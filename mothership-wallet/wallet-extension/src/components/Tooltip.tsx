import './styles/tooltip.css'
export default function Tooltip({label,children}:{label:string,children?:any}){
  return <span className="tip"><span className="i">i</span><span className="bubble">{label}</span>{children}</span>
}
