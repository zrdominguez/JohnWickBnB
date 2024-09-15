export const Tooltip = ({name}) =>{
  return (
    <p
    style={{
      fontFamily: 'sans-serif',
      color:'#ebf5f0',
      zIndex: 10,
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: '#020a15',
      padding:'2px',
    }}
    >{name}</p>
  )
}
