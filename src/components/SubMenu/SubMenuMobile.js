import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { array } from 'prop-types'
import './SubMenu.css';

class SubMenuMobile extends Component {
    static propTypes = {
        items: array
    }

    static defaultProps = {
        items: []
    }

    state = { url: this.props.history.location.pathname };
    select = React.createRef();

    onItemClick = e => {
        const currentLocation = this.props.history.location.pathname;
        const newUrl = e.target.value;

        const shouldRedirect = currentLocation !== newUrl;

        if (shouldRedirect) {
            this.props.history.push(newUrl);
        }
        this.select.current.selectedIndex = 0;

    }

    menuItem = (item, isSub) => {
        return (
            <React.Fragment key={item.id}>
                <option value={item.url}>
                    {isSub ? '-' : ''}
                    {item.title}
                </option>
                {item.subItems &&
                    item.subItems.map((subItem, j) => this.menuItem(subItem, true))
                }
            </React.Fragment>
        )
    }

    render() {
        const { items, history } = this.props
        const { redirect, url } = this.state;

        return (
            <div className="sub-menu-mobile">
                {items.length > 0 ?
                    <div className="sub-menu__wrapper">
                        <select
                            ref={this.select}
                            className='sub-menu'
                            onChange={this.onItemClick}
                        >
                            <option hidden>
                                Visa undersidor
                                </option>
                            {items.map(item => this.menuItem(item, false))}
                        </select>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}

export default withRouter(SubMenuMobile)
