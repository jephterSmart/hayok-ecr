const KeyboardArrowUp = ({className,style=null,...rest}) => {
    return(
        <div className={className? className : "  "} {...rest}>
        <svg xmlns="http://www.w3.org/2000/svg" height={`${style?.height || '24px'}`} viewBox={`0 0  ${style?.weight||'24px'} ${style?.height||'24px'} `}  width={`${style?.width || '24px'}`} 
         fill={`${style?.color || 'var(--primaryColor)'}`} >
           <path d="M0 0h24v24H0V0z" fill="none"/><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z"/>
         </svg>
        </div>
    )
}
export default KeyboardArrowUp;