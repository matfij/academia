import { NavLink } from 'react-router-dom';

type NavbarProps = {
    username: string | undefined;
};

export default function Navbar({ username }: NavbarProps) {
    const renderLoginOrLogout = () => {
        if (username) {
            return <NavLink to="/logout">{username}</NavLink>;
        } else {
            return <NavLink to="/login">Login</NavLink>;
        }
    };

    return (
        <div className="navbarWrapper">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/spaces">Spaces</NavLink>
            <NavLink to="/createSpace">Create Space</NavLink>
            {renderLoginOrLogout()}
        </div>
    );
}
