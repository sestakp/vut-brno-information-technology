import Navbar from "../components/Layout/Navbar/Navbar"
import Footer from "../components/Layout/Footer/Footer"
import FlashMessage from "../components/FlashMessage/FlashMessage"

const Guest = (props) => {


    return(
        <>
            <FlashMessage />        
            <div className="min-vh-100 dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-200 text-neutral-900">
                <Navbar />
                <main style={{minHeight: "80vh"}}>
                    {props.children}
                </main>
                <Footer />
            </div>

        </>

    )
}

export default Guest