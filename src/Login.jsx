import Header from './components/Header/Header.jsx'
import { InfoBox } from './components/InfoBox/InfoBox.jsx'
import ActionButton from './components/ActionButton/ActionButton.jsx'
import  './Register.css'


function Register() {
    return (
        <>
            <Header />
            <div className="register-container"> 
                <InfoBox label="Username" />
                
                <InfoBox label="Password" type="password" />
                
                <ActionButton
                    className="btn-register"
                    
                >
                    Login
                </ActionButton>
            </div>
        </>
    )
}
export default Register;