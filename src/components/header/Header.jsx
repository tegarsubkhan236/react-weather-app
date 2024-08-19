import {Dropdown, DropdownButton, Form, InputGroup, Nav, Navbar} from "react-bootstrap";
import {GeoAlt, Moon, Search, Sun, Translate} from "react-bootstrap-icons";
import {useContext} from "react";
import {ThemeContext} from "../../context/ThemeContext.jsx";
import {LanguageContext} from "../../context/LanguageContext.jsx";

function Header({ handleSearchSubmit, searchQuery, setSearchQuery, cityName, stateName, countryName }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { language, toggleLanguage } = useContext(LanguageContext);

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
                            placeholder={language === "en" ? "Search" : "Cari"}
                            aria-label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Form>
            </Nav>

            <Nav className="ml-auto">
                <DropdownButton
                    title={<Translate/>}
                    variant={theme}
                    size="md"
                    align="end"
                    onSelect={toggleLanguage}
                >
                    <Dropdown.Item eventKey="en" active={language === "en"}>EN</Dropdown.Item>
                    <Dropdown.Item eventKey="id" active={language === "id"}>ID</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    title={theme === "light" ? <Sun color="black"/> : <Moon/>}
                    variant={theme}
                    size="md"
                    align="end"
                    onSelect={toggleTheme}
                >
                    <Dropdown.Item eventKey="dark">Dark</Dropdown.Item>
                    <Dropdown.Item eventKey="light">Light</Dropdown.Item>
                    <Dropdown.Item eventKey="auto">Auto</Dropdown.Item>
                </DropdownButton>
            </Nav>
        </Navbar>
    );
}

export default Header;