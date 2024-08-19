import {Button, Form, InputGroup, Nav, Navbar} from "react-bootstrap";
import {GeoAlt, Moon, Search, Sun} from "react-bootstrap-icons";

function Header({ handleSearchSubmit, searchQuery, setSearchQuery, toggleTheme, isLightMode, cityName, stateName, countryName }) {
    return (
        <Navbar>
            <Navbar.Brand style={{display: 'flex', alignItems: 'center'}}>
                <GeoAlt style={{marginRight: '8px'}}/>
                <h6 style={{margin: 0}}>
                    {cityName}
                    {stateName && `, ${stateName}`}
                    {`, ${countryName}`}
                </h6>
            </Navbar.Brand>

            <Nav className="mx-auto" style={{flex: 1, justifyContent: 'center'}}>
                <Form className="d-flex" onSubmit={handleSearchSubmit}
                      style={{maxWidth: '400px', width: '100%'}}>
                    <InputGroup>
                        <InputGroup.Text>
                            <Search/>
                        </InputGroup.Text>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Form>
            </Nav>

            <Nav className="ml-auto">
                <Button
                    onClick={toggleTheme}
                    className="theme-toggle-button"
                >
                    {isLightMode ? <Sun color="black"/> : <Moon/>}
                </Button>
            </Nav>
        </Navbar>
    );
}

export default Header;