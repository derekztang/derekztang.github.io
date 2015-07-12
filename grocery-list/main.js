function Item(name, type, price) {
  this.name = name;
  this.type = type;
  this.price = price;
}

function List() {
  this.contents = [];
  for (item in arguments) {
    this.contents.push(arguments[item]);
  };
}
List.prototype.add = function() {
  for (item in arguments) {
    this.contents.push(arguments[item]);
  };
  this.save();
}
List.prototype.remove = function(item) {
  var ind = this.contents.indexOf(item);
  this.contents.splice(ind, 1);
  this.save();
}
List.prototype.removeAll = function() {
  this.contents = [];
  this.save();
}
List.prototype.totalCost = function() {
  return this.contents.reduce(function(a, b) {return a + +b.price}, 0);
}
List.prototype.sortPrice = function() {
  this.contents.sort(function(a, b) {return b.price - a.price});
  return this;
}
List.prototype.sortType = function() {
  this.contents.sort(function(a, b) {return b.type < a.type});
  return this;
}
List.prototype.save = function() {
  localStorage.setItem('grocList', JSON.stringify(this.contents));
}


var storage = localStorage.getItem('grocList');

if (storage) {
  var list = new List();
  storage = JSON.parse(storage);
  storage.forEach(function(item) {
    list.add(new Item(
      item.name,
      item.type,
      item.price
    ));
  });
} else {
  var milk = new Item('milk', 'dairy', 3),
      oranges = new Item('oranges', 'fruit', 2),
      avocados = new Item('avocados', 'fruit', 5),
      steak = new Item('steak', 'meat', 10),
      slimJim = new Item('slim jim', 'meat', 1),
      list = new List(milk, oranges, steak, avocados, slimJim);
}



//---------------------------------------------


var ListHeader = React.createClass({
  render: function() {
    return (
      <thead>
        <tr className="stuff">
          <th> Item <br />({this.props.list.contents.length} total)</th>
          <th> Type </th>
          <th> Price <br />(${this.props.list.totalCost()}) </th>
        </tr>
      </thead>
    );
  }
});

var ListBody = React.createClass({
  render: function() {
    var tableNodes = this.props.list.contents.map(function (item, i) {
      var thisPrice = parseFloat(Math.round(item.price * 100) / 100).toFixed(2);
      return (
        <tr className="tableRow">
          <td className="tname"> {item.name} </td>
          <td className="ttype"> {item.type} </td>
          <td className="tprice"> ${thisPrice} </td>
        </tr>
      );
    });
    return (
      <tbody>
        {tableNodes}
      </tbody>
    );
  }
});

var AddForm = React.createClass({
  addItem: function(event) {
    event.preventDefault();
    var itemName = this.refs.name.getDOMNode().value.trim();
    var itemType = this.refs.type.getDOMNode().value.trim();
    var itemPrice = this.refs.price.getDOMNode().value.trim();
    if (isNaN(+itemPrice)) {
      alert('Price must be a number.');
      return;
    }
    if (!itemName) {
      alert('Item must have a name.');
      return;
    }
    var newItem = new Item(itemName, itemType, itemPrice);
    this.props.onUserInput(newItem);
    this.refs.name.getDOMNode().value = '';
    this.refs.type.getDOMNode().value = '';
    this.refs.price.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="form-inline" onSubmit={this.addItem} autoComplete="on">
          <div className="form-group">
            <input type="text" className="form-control" ref="name" placeholder="item name" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" ref="type" placeholder="type" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" ref="price" placeholder="price" />
          </div>
          <button type="submit" className="btn btn-primary"> Submit </button>
        </form>
    );
  }
});

var DeleteForm = React.createClass({
  deleteStuff: function (event) {
    event.preventDefault();
    var deleteThese = [];
    for (ind in this.refs) {
      if (this.refs[ind].getDOMNode().checked) {
        deleteThese.push(this.props.list.contents[ind]);
        this.refs[ind].getDOMNode().checked = false;
      }
    };
    this.props.onUserInput(deleteThese);
  },
  render: function() {
    var deleteNodes = this.props.list.contents.map(function (_, i) {
      return (
        <tr className="stuff">
          <td> <input type="checkbox" ref={i} value={i}/> </td>
        </tr>
      );
    });
    return (
      <div className=" col-xs-1">
        <form id="delete" onSubmit={this.deleteStuff}>
          <table className="table table-hover">
            <thead><tr><th>
              <button type="submit" id="trash"><br />
              <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
              </button>
            </th></tr></thead>
            <tbody>{deleteNodes}</tbody>
          </table>
        </form>
      </div>
    );
  }
});

var ListWindow = React.createClass({
  getInitialState: function() {
    return {data: this.props.data};
  },
  sortPrice: function(event) {
    var newData = this.state.data.sortPrice();
    this.setState({data: newData});
  },
  sortType: function(event) {
    var newData = this.state.data.sortType();
    this.setState({data: newData});
  },
  clearList: function(event) {
    this.setState({data: new List()});
    this.state.data.removeAll();
  },
  handleAddItem: function(item) {
    var newData = this.state.data;
    newData.add(item);
    this.setState({data: newData});
  },
  handleDelete: function(deleteThese) {
    var newData = this.state.data;
    deleteThese.forEach(function(item) {
      newData.remove(item);
    });
    this.setState({data: newData})
  },
  render: function() {
    return (
      <div className="container">

        <div className="row">
          <div className=" col-xs-11">
            <table className="table table-hover">
              <ListHeader list={this.state.data} />
              <ListBody list={this.state.data} />
            </table>
          </div>
          <DeleteForm onUserInput={this.handleDelete} list={this.state.data} />
        </div>

        <button onClick={this.sortPrice} className="btn btn-default"> Sort Price </button>
        <button onClick={this.sortType} className="btn btn-default"> Sort Type </button>
        <button onClick={this.clearList} className="btn btn-danger"> Clear List </button>

        <h3>Add Items</h3>
        <AddForm onUserInput={this.handleAddItem} />

      </div>
    );
  }
});

React.render(
  <ListWindow data={list} />,
  document.getElementById('content')
);