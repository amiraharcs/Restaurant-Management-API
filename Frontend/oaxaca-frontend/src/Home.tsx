import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main>
            <p>This is the home page</p>
            <Link to="/menu">Go To Menu</Link>
            <Link to="/login">Go To Staff Login</Link>
        </main>
    )
}