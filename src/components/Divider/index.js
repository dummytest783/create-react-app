import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import './index.css'

function Divider({label}) {
    return (
        <div className="divider"> 
            <span className='dividerLabel'> {label} <FontAwesomeIcon icon={faChartSimple} size={12} /> </span> 
        </div>
    )
  }
  export default Divider;