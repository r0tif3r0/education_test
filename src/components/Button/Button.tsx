import style from './Button.module.scss'

const Button = ({text, onClick, className, isDisabled } : {text:String, onClick:any, className:CSSModuleClasses[string], isDisabled:boolean}) => {
    return (
      <button className={`${className} ${style.button}`} onClick={onClick} disabled={isDisabled}>
        {text}
      </button>
    );
  }
  
  export default Button;