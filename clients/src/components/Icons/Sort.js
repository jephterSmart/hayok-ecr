const Sort = ({className,style=null,...rest}) => {
    return(
        <div className={className? className : "  "} {...rest}>
        <svg xmlns="http://www.w3.org/2000/svg" height={`${style?.height || '24px'}`} viewBox={`0 0  ${style?.weight||'24px'} ${style?.height||'24px'} `}  width={`${style?.width || '24px'}`} 
         fill={`${style?.color || 'var(--primaryColor)'}`} >
           <path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
         </svg>
        </div>
    )
}
export default Sort;