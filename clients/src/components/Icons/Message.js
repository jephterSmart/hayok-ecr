const Message = ({className,style=null,...rest}) => {
    return(
        <div className={className? className : "  "} {...rest}>
        <svg xmlns="http://www.w3.org/2000/svg" height={`${style?.height || '24px'}`} viewBox={`0 0  ${style?.weight||'24px'} ${style?.height||'24px'} `}  width={`${style?.width || '24px'}`} 
         fill={`${style?.color || 'var(--primaryColor)'}`} >
            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"/>
         </svg>
        </div>
    )
}
export default Message;