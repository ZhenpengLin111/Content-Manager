import { dayjs } from 'element-plus'

export const formatTime = (time) => dayjs(time).format('MMMM D, YYYY h:mm A')
