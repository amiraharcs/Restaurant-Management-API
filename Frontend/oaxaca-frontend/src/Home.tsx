import { Link } from "react-router-dom"

export default function Home() {
    return (
        <main>
            <p>This is the home page</p>
            <Link to="/menu">Go To Menu</Link>
        </main>
    )
}