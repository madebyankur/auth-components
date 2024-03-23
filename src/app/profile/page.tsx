import { NextPage } from 'next'
import Image from 'next/image'
import React from 'react'

import OrganizationSwitcher from '@/components/organization-switcher'
import { getUserProfileData } from '@/services/profile.service'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { UserProfile } from '@auth0/nextjs-auth0/client'

const Profile: NextPage = withPageAuthRequired(
    async () => {
        const user: UserProfile = await getUserProfileData()

        const fetchLocal = async (
            endpoint: string,
            queryParams: Record<string, string>
        ) => {
            // Construct the query string using URLSearchParams
            const queryString = new URLSearchParams(queryParams).toString()
            const url = `${endpoint}?${queryString}`
            const response = await fetch(url)

            if (!response.ok) throw new Error('Error fetching business data!')

            const data = await response.json()
            return data
        }

        // Usage:
        const organizations = await fetchLocal(
            'http://localhost:3000/api/organizations',
            {
                id: user!.sub || '',
            }
        )

        const organizationName = await fetchLocal(
            'http://localhost:3000/api/organization-name',
            {
                id: user.org_id || '',
            }
        )

        return (
            <div className="mx-auto flex h-screen max-w-prose flex-col items-center justify-center gap-10">
                <div className="flex flex-col gap-10">
                    <div className="relative z-10 flex flex-col justify-center px-3 pt-2">
                        <OrganizationSwitcher
                            organizations={organizations}
                            organizationName={organizationName}
                        />
                    </div>
                </div>
            </div>
        )
    },
    { returnTo: '/profile' }
)

export default Profile
