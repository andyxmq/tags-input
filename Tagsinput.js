;(function(){
  var Input = React.createClass({
    render: function(){
      var inputClass = this.props.invalid ? 
        "tagsinput-input tagsinput-input-invalid" :
        "tagsinput-input"
      return this.transferPropsTo(
        React.DOM.input({
          type: "text",
          className: inputClass,
        })
      );
    }
  });

  var Tag = React.createClass({
    render: function(){
      return (
        React.DOM.span({
          className: "tagsinput-tag"
        }, this.props.tag + " ", React.DOM.a({
          className: "tagsinput-remove",
          onClick: this.props.remove
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
      if(e.keyCode === 9 || e.keyCode === 13){ // tab enter按键新增tab
        this.addTag();
      }

      if(e.keyCode === 8 && this.state.tags.length > 0 && this.state.tag === ""){
        this.removeTag(this.state.tags.length - 1);
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

    removeTag: function(i){
      var tags = this.state.tags.slice(0);
      var tag = tags.splice(i,1);
      this.setState({
        tags,
        invalid: false
      });
    },

    render: function(){
      var tagNodes = this.state.tags.map(function(tag,i){
        return Tag({
          key: i,
          tag: tag,
          remove: this.removeTag.bind(null, i)
        });
      }.bind(this));
      return (
        React.DOM.div({
          className: "tagsinput"
        }, tagNodes, Input({
          ref: "input",
          placeholder: this.props.placeholder,
          value: this.state.tag,
          invalid: this.state.invalid,
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