import './index.css'
function Divider({label}) {
    return (
        <div className="divider"> 
            <span className='dividerLabel'> {label} </span> 
        </div>
    )
  }
  export default Divider;