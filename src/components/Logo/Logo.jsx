import { Box} from '@mui/material'
import styles from '../Main/TodoPage.module.css'
import TaskIcon from '@mui/icons-material/Task';

const Logo = () => {
  return (
    <Box className={styles.header}>
        <Box className={styles.logo}>
          <TaskIcon sx={{ width: '60px', height: '60px' }}></TaskIcon>
          <h1>ToDo App</h1>
        </Box>
      </Box>
  )
}

export default Logo