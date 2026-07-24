import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  configureAuthPersistence,
  createAuthAccount,
  deleteAuthenticatedUser,
  loginWithEmailAndPassword,
  logoutAuthenticatedUser,
  subscribeToAuthChanges,
} from '../services/authService'
import { createUserProfile, getUserProfile } from '../services/userService'
import { getReadableAuthError, isValidRole } from '../utils/authUtils'

// This context intentionally lives with its provider as the Module 1 auth boundary.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

function requireValidProfile(profile) {
  if (!profile) {
    throw new Error(
      'Your account does not have a Kindred user profile. Please contact support.',
    )
  }

  if (!isValidRole(profile.role)) {
    throw new Error(
      'Your Kindred user profile has an invalid role. Please contact support.',
    )
  }

  return profile
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const authOperationInProgress = useRef(false)

  useEffect(() => {
    let unsubscribe = () => {}
    let isActive = true

    const resolveAuthentication = async () => {
      try {
        await configureAuthPersistence()
        if (!isActive) return

        unsubscribe = subscribeToAuthChanges(
          async (firebaseUser) => {
            if (authOperationInProgress.current) return

            if (!firebaseUser) {
              setUser(null)
              setUserProfile(null)
              setLoading(false)
              return
            }

            try {
              const profile = requireValidProfile(
                await getUserProfile(firebaseUser.uid),
              )
              if (!isActive) return
              setUser(firebaseUser)
              setUserProfile(profile)
            } catch (profileError) {
              try {
                await logoutAuthenticatedUser()
              } catch {
                // The original profile error is more useful to the user.
              }
              if (!isActive) return
              setUser(null)
              setUserProfile(null)
              setError(getReadableAuthError(profileError))
            } finally {
              if (isActive) setLoading(false)
            }
          },
          (authError) => {
            if (!isActive) return
            setError(getReadableAuthError(authError))
            setLoading(false)
          },
        )
      } catch (configurationError) {
        if (!isActive) return
        setError(getReadableAuthError(configurationError))
        setLoading(false)
      }
    }

    resolveAuthentication()

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  const register = async ({ name, email, password, role }) => {
    authOperationInProgress.current = true
    setAuthLoading(true)
    setError('')
    let createdUser = null

    try {
      createdUser = await createAuthAccount(email, password)
      const profile = requireValidProfile(
        await createUserProfile({
          uid: createdUser.uid,
          name,
          email: createdUser.email || email,
          role,
        }),
      )
      setUser(createdUser)
      setUserProfile(profile)
      return profile
    } catch (registrationError) {
      let finalError = registrationError

      // Avoid leaving an Authentication account without its required Firestore
      // role profile when registration fails between those two writes.
      if (createdUser) {
        try {
          await deleteAuthenticatedUser(createdUser)
        } catch {
          finalError = new Error(
            'Your user profile could not be created, and automatic account cleanup failed. Please contact support before trying again.',
          )
        }
      }

      const message = getReadableAuthError(finalError)
      setError(message)
      throw new Error(message)
    } finally {
      authOperationInProgress.current = false
      setAuthLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    authOperationInProgress.current = true
    setAuthLoading(true)
    setError('')

    try {
      const authenticatedUser = await loginWithEmailAndPassword(email, password)
      const profile = requireValidProfile(
        await getUserProfile(authenticatedUser.uid),
      )
      setUser(authenticatedUser)
      setUserProfile(profile)
      return profile
    } catch (loginError) {
      if (
        loginError.message?.includes('does not have a Kindred user profile') ||
        loginError.message?.includes('has an invalid role')
      ) {
        try {
          await logoutAuthenticatedUser()
        } catch {
          // Preserve the profile error that caused access to be denied.
        }
      }

      const message = getReadableAuthError(loginError)
      setError(message)
      throw new Error(message)
    } finally {
      authOperationInProgress.current = false
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    authOperationInProgress.current = true
    setAuthLoading(true)
    setError('')

    try {
      await logoutAuthenticatedUser()
      setUser(null)
      setUserProfile(null)
    } catch (logoutError) {
      const message = getReadableAuthError(logoutError)
      setError(message)
      throw new Error(message)
    } finally {
      authOperationInProgress.current = false
      setAuthLoading(false)
    }
  }

  const clearError = () => setError('')

  const value = useMemo(
    () => ({
      user,
      userProfile,
      role: userProfile?.role || null,
      loading,
      authLoading,
      error,
      register,
      login,
      logout,
      clearError,
    }),
    [user, userProfile, loading, authLoading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
