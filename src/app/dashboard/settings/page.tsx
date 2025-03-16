import { SeetingsTabs } from '@/components/SeetingsTabs'
import {
  Plan,
  Profile,
} from './Tabs'

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-medium text-zinc-900 dark:text-zinc-100">
        Settings
      </h1>
      <SeetingsTabs
        tabs={[
          { value: 'profile', title: 'My Profile', content: <Profile /> },
          { value: 'plan', title: 'Plan', content: <Plan /> },
        ]}
      />
    </>
  )
}
