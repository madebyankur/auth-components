'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpDownIcon, ChevronDown, ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

import cn from '@/utils/cn'
import { useUser } from '@auth0/nextjs-auth0/client'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

// Define the types for your organizations and organizationName
type Organization = {
    id: string
    display_name: string
    name: string
}

type OrganizationSwitcherProps = {
    organizations: Organization[]
    organizationName: Organization // Assuming organizationName has the same structure as an item in organizations
}

export default function OrganizationSwitcher({
    organizations,
    organizationName,
}: OrganizationSwitcherProps) {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    return (
        <DropdownMenu.Root>
            <AnimatePresence>
                <DropdownMenu.Trigger asChild>
                    <motion.button className="z-10 flex w-[320px] items-center justify-between gap-1 space-x-2 rounded-2xl border border-neutral-200 bg-neutral-50 py-2 pl-2 pr-4 shadow-sm outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-black/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-900/80 dark:focus:ring-white/5">
                        <Image
                            width={40}
                            height={40}
                            src={user!.picture || ''}
                            alt={user!.name || ''}
                            className={cn(
                                'h-10 w-10 rounded-lg border border-black/10 dark:border-white/10',
                                isLoading
                                    ? 'scale-125 blur-xl'
                                    : 'scale-100 blur-none'
                            )}
                            loading="lazy"
                        />
                        <div className="flex w-full items-center justify-between">
                            <span className="flex text-base font-medium text-neutral-900 dark:text-neutral-100">
                                {user!.nickname || user!.name}
                            </span>
                            <span className="flex rounded-md border border-neutral-500 bg-neutral-300 px-1 font-mono text-sm uppercase text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                                {organizationName.display_name}
                            </span>
                        </div>
                        <ChevronDown
                            className="h-6 w-6 font-semibold text-neutral-500"
                            strokeWidth={3}
                        />
                    </motion.button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content asChild>
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.75,
                            translateY: -50,
                            rotateX: 90,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            translateY: 0,
                            rotateX: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.75,
                            translateY: -50,
                            rotateX: 90,
                        }}
                        className="z-0 mt-2 flex w-[320px] flex-col rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-black dark:text-white"
                    >
                        {organizations.map((organization) => (
                            <a
                                key={organization.id}
                                href={
                                    '/api/auth/login?organization=' +
                                    organization.id
                                }
                            >
                                <DropdownMenu.Item className="cursor-pointer rounded-lg p-3 text-sm outline-none transition-all duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-900">
                                    {organization.display_name}
                                </DropdownMenu.Item>
                            </a>
                        ))}
                    </motion.div>
                </DropdownMenu.Content>
            </AnimatePresence>
        </DropdownMenu.Root>
    )
}
