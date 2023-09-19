import { Container, Paper } from "@mui/material";
import employeesClient from "../../api/employeesClient";
import employeesAction from "../../redux/employees/employeesActions";
import { connect } from "react-redux";



const Doc = (props) => {
    return(
        <Container>
            <Paper>
                <h1>Hotelový informační systém</h1>
                <dl>
                <dt>Autoři</dt>
                <dd>Bc. Petr Doležal
                    <a href="mailto:xdolez91@stud.fit.vutbr.cz">xdolez91@stud.fit.vutbr.cz</a> -
                    Backend v Jakarta EE
                </dd>
                <dd>Bc. Vojtěch Kulíšek
                    <a href="mailto:xkulis03@stud.fit.vutbr.cz">xkulis03@stud.fit.vutbr.cz</a> - 
                    Backend v Jakarta EE a autorizace
                </dd>
                <dd>Bc. Jakub Málek
                    <a href="mailto:xmalek17@stud.fit.vutbr.cz">xmalek17@stud.fit.vutbr.cz</a> - 
                    Frontend React.JS
                </dd>
                <dd>Bc. Pavel Šesták
                    <a href="mailto:xsesta07@stud.fit.vutbr.cz">xsesta07@stud.fit.vutbr.cz</a> - 
                    Frontend React.JS a backend Jakarta EE
                </dd>
            </dl>
            <h2>Uživatelé systému pro testování</h2>
            <p>Uveďte prosím existující zástupce <strong>všech rolí uživatelů</strong>.</p>
            <p>Pro vytvoreni techto roli kliknete <b style={{cursor: "pointer"}} onClick={() => props.init()}>ZDE</b>.</p>
            <table>
            <tr><th>Login</th><th>Heslo</th><th>Role</th></tr>
            <tr><td>client@test.com</td><td>123456</td><td>Klient</td></tr>
            <tr><td>manager@test.com</td><td>123456</td><td>Manažer</td></tr>
            <tr><td>cleaner@test.com</td><td>123456</td><td>Uklízeč</td></tr>
            <tr><td>cook@test.com</td><td>123456</td><td>Kuchař</td></tr>
            <tr><td>receptionist@test.com</td><td>123456</td><td>Recepční</td></tr>
            </table>

            <h2>Postup instalace</h2>
            V následujících bodech bude stručný popis pro rozjetí vývojového prostředí, je nutné ovšem podotknout, že na různých
            mašinách se můžou vyskytnout různé problémy, které daný tutoriál nemusí podchytit, jelikož se neprojevili
            <h3>Client</h3>
            <p>První prerekvizitou je nainstalovaný node.JS (referenční verze 18.13.0)</p>
            <p>Následně je nutné nainstalovat React.JS viz <a
                    href="https://www.tutorialspoint.com/reactjs/reactjs_environment_setup.htm">https://www.tutorialspoint.com/reactjs/reactjs_environment_setup.htm</a>
            </p>
            <p>Ve složce Client spustit příkaz npm install</p>
            <p>Ve složce Client spustit příkaz npm run</p>
            <p>Případně podle konzole doinstalovat další knihovny pomocí npm install "package" --legacy-peer-deps</p>
            <h3>Backend</h3>
            <p>Pro úspěšný setup backendu je potřeba Java, vývojové prostředí a běhový server</p>
            <p>Při vývoji byl použit server glassfish 7.0.1 Full profile, který lze stáhnout zde https://projects.eclipse.org/projects/ee4j.glassfish/downloads</p>
            <p>Pro kompilaci backendu lze využít tnípříkazy mavenu, příkazy naleznete v gitlab-ci.yml</p>
            <p>Databáze by měla běžet embedded a není nutné instalovat vlastní</p>
            <p>Vytvořit testovací data lze pomocí odkazu v patičce klientské aplikace.</p>
            </Paper>
        </Container>
    )
}


const mapStateToProps = (state, ownProps) => ({  
  });
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    init: () => dispatch(employeesAction.init())
});

export default connect(mapStateToProps, mapDispatchToProps)(Doc);