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
        placeholder: 'Add a tag',
        validate: function(tag) {return tag !== ""},
        addKeys: [13,9],
        removeKeys: [8],
        onTagAdd: function () {},
        onTagRemove: function () {},
        onChange: function () {}
      };
    },
    getInitialState: function(){
      return {
        tags: [],
        tag: "",
        invalid: false
      };
    },
    componentWillMount () {
      this.setState({
        tags: this.props.tags.slice(0)
      });
    },
    onChange(event) {
      this.setState({
        tag: event.target.value
      });
    },

    onKeyDown(e){
      var add = this.props.addKeys.indexOf(e.keyCode) !== -1;
      var remove = this.props.removeKeys.indexOf(e.keyCode) !== -1
      if(add){ // tab enter按键新增tab
        e.preventDefault();
        this.addTag();
      }

      if(remove && this.state.tags.length > 0 && this.state.tag === ""){
        this.removeTag(this.state.tags.length - 1);
      }
    },

    onBlur: function (e){
      if(this.state.tag !== "" && !this.state.invalid){
        this.addTag();
      }
    },

    getTags () {
      return this.state.tags
    },

    addTag(){
      var tag = this.state.tag.trim();

      if(this.state.tags.indexOf(tag) !== -1 || !this.props.validate(tag)){
        return this.setState({
          invalid: true,
        });
      }

      this.setState({
        tags: this.state.tags.concat([tag]),
        tag: "",
        invalid: false,
      },function(){
        this.props.onTagAdd(tag)
        this.props.onChange(this.state.tags)
      });
    },

    removeTag: function(i){
      var tags = this.state.tags.slice(0);
      var tag = tags.splice(i,1);
      this.setState({
        tags,
        invalid: false
      }, function(){
        this.props.onTagRemove(tag[0])
        this.props.onChange(tags)
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
          onBlur: this.onBlur
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