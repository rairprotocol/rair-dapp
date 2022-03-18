import CloseIcon from '@mui/icons-material/Close';
import { Alert } from './styles'

const AlertMetamask = ({ selectedChain, realNameChain, setShowAlert }) => (
    <Alert>
        <span>Your wallet is connected to the <b>{selectedChain}</b> network. Please switch to <b>{realNameChain}</b> network.</span>
        <span onClick={() => setShowAlert(false)}>
            <CloseIcon />
        </span>
    </Alert>
)


export default AlertMetamask