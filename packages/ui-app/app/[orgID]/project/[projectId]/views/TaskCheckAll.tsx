import { useTaskFilter } from '@/features/TaskFilter/context'
import { useTaskStore } from '@/store/task'
import { Form } from '@shared/ui'
import { useEffect, useMemo, useState } from 'react'

export default function TaskCheckAll({ groupId }: { groupId: string }) {
  const [checked, setChecked] = useState(false)
  const { tasks, selected, taskLoading, toggleMultipleSelected } =
    useTaskStore()
  const { groupBy, isGroupbyStatus, isGroupbyAssignee, isGroupbyPriority } =
    useTaskFilter()

  const taskIds = useMemo(() => {
    const ids: string[] = []
    tasks.map(task => {
      if (isGroupbyStatus && task.taskStatusId !== groupId) return null

      if (isGroupbyAssignee) {
        if (task.assigneeIds.length && !task.assigneeIds.includes(groupId)) {
          return null
        }

        if (!task.assigneeIds.length && groupId !== 'NONE') {
          return null
        }
      }

      if (isGroupbyPriority && task.priority !== groupId) {
        return null
      }

      ids.push(task.id)
    })

    return ids
  }, [groupBy, groupId, taskLoading])

  const onChecked = (checked: boolean) => {
    toggleMultipleSelected(checked, taskIds)
  }

  useEffect(() => {
    // uncheck if one of items uncheck
    if (taskIds.length) {
      const map = new Map()
      let counter = 0

      taskIds.forEach(t => {
        map.set(t, true)
      })

      selected.forEach(s => {
        if (map.has(s)) {
          counter++
        }
      })

      if (counter !== taskIds.length && checked) {
        setChecked(false)
      }

      if (counter === taskIds.length && !checked) {
        setChecked(true)
      }
    }
  }, [selected, taskIds, checked])

  return (
    <Form.Checkbox
      checked={checked}
      onChange={val => {
        onChecked(val)
        setChecked(val)
      }}
    />
  )
}
