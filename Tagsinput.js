;(function(){
  var React = this.React || require('React');

  var Input = React.createClass({
    render: function(){
      return this.transferPropsTo(
        React.DOM.input({
          type: "text",
          className: "react-tagsinput-input",
        })
      );
    }
  });

  var Tag = React.createClass({
    render: function(){
      return (
        React.DOM.span({
          className: "react-tagsinput-tag"
        }, this.props.tag + " ", React.DOM.a({
          className: "react-tagsinput-remove",
        }, "X"))
      );
    }
  });

  var TagsInput = React.createClass({
    getDefaultProps: function(){
      return {
        tags: [],
        placeholder: 'add a tag',
      };
    },
    getInitialState: function(){
      return {
        tags: [],
        tag: "",
        invalid: false
      };
    },
    onChange(event) {
      this.setState({
        tag: event.target.value
      });
    },

    onKeyDown(e){
      if(e.keyCode === 9 || e.keyCode === 13){
        this.addTag();
      }
    },

    addTag(){
      var tag = this.state.tag.trim();

      if(this.state.tags.indexOf(tag) !== -1 || tag ===""){
        return this.setState({
          invalid: true,
        });
      }

      this.setState({
        tags: this.state.tags.concat([tag]),
        tag: "",
        invalid: false,
      },function(){

      });
    },

    render: function(){
      var tagNodes = this.state.tags.map(function(tag,i){
        return Tag({
          key: i,
          tag: tag,
        });
      }.bind(this));
      return (
        React.DOM.div({
          className: "react-tagsinput"
        }, tagNodes, Input({
          ref: "input",
          placeholder: this.props.placeholder,
          value: this.state.tag,
          onKeyDown: this.onKeyDown,
          onChange: this.onChange,
        }))
      );
    }
  });

  if(typeof module === 'object' && module.exports){
    module.exports = TagsInput;
  }else{
    this.ReactTagsInput = TagsInput;
  }


}.call(this));