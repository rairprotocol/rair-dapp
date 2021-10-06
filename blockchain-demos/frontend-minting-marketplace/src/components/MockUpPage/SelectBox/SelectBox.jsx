import React from "react";
import "./styles.css";

class SelectBox extends React.Component {
  state = {
    items: this.props.items || [],
    showItems: false,
    selectedItem: this.props.items && this.props.items[0],
    primaryColor: this.props.primaryColor,
  };

  dropDown = () => {
    this.setState((prevState) => ({
      showItems: !prevState.showItems,
    }));
  };

  selectItem = (item) => {
    this.setState({
      selectedItem: item,
      showItems: false,
    });
  };

  render() {
    return (
      <div className="select-box--box">
        <div style={{backgroundColor: `var(--${this.state.primaryColor})`,}} className="select-box--container">
          <div className="select-box--selected-item">
           <span style={{paddingRight: '10px'}}>{this.state.selectedItem.pkey}</span>
           <span>{this.state.selectedItem.value}</span>  
          </div>
          <div className="select-box--arrow" onClick={this.dropDown}>
            <span
              className={`${
                this.state.showItems
                  ? "select-box--arrow-up"
                  : "select-box--arrow-down"
              }`}
            />
          </div>

          <div
            style={{ display: this.state.showItems ? "block" : "none" }}
            className={"select-box--items"}
          >
            {this.state.items.map((item) => (
              <div
                key={item.id}
                onClick={() => this.selectItem(item)}
                className={this.state.selectedItem === item ? "selected" : ""}
              >
                <span style={{paddingRight: '10px'}}>{item.pkey}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectBox;
