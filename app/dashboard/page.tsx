import React from 'react'
import Dashboard from '../components/Dashboard'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function page() {
  let session

  try {
    // Check authentication on server side
    const resolvedHeaders = await headers();
    session = await auth.api.getSession({
      headers: resolvedHeaders,
    })

    // If no session, redirect to home page
    if (!session || !session.user) {
      redirect('/')
    }
  } catch (error) {
    // If there's an error checking session, redirect to home page
    console.error('Auth error:', error)
    redirect('/')
  }
  return (
    <>
      <Dashboard />
    </>
  )
}
