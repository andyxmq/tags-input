;(function(root, factory){
  if (typeof define === 'function' && define.amd) { // AMD
    define(['react'], factory)
  } else if (typeof module !== "undefined" && module.exports) { // CMD
    module.exports = factory(require('react'))
  } else {
    root.TagsInput = factory(root.React)
  }
}(this,function(React){
  "use strict"
  var Input = React.createClass({
    render: function(){
      var ns = this.props.ns;
      var inputClass = ns+"tagsinput-input "+ ( this.props.invalid? ns+ "tagsinput-invalid": "")
      return React.createElement("input",
        React.__spread({}, this.props, {
          type: "text",
          className: inputClass,
          placeholder: this.props.placeholder
        })
      );
    }
  });

  var Tag = React.createClass({
    render: function(){
      return (
        React.createElement("span", {
          className: this.props.ns+"tagsinput-tag"
        }, this.props.tag +" ", React.createElement("a", {
          onClick: this.props.remove,
          className:  this.props.ns+"tagsinput-remove"
        }, "X"))
      );
    }
  });

  var TagsInput = React.createClass({
    propTypes: {
      value: React.PropTypes.array,
      valueLink: React.PropTypes.object,
      defaultValue: React.PropTypes.array,
      placeholder: React.PropTypes.string,
      classNamespace: React.PropTypes.string,
      addKeys: React.PropTypes.array,
      removeKeys: React.PropTypes.array,
      addOnBlur: React.PropTypes.bool,
      onChange: React.PropTypes.func,
      onChangeInput: React.PropTypes.func,
      onBlur: React.PropTypes.func,
      onTagAdd: React.PropTypes.func,
      onTagRemove: React.PropTypes.func,
      transform: React.PropTypes.func,
      validate: React.PropTypes.func
    },
    getDefaultProps: function(){
      return {
        // value: [],
        defaultValue: [],
        placeholder: 'Add a tag',
        classNamespace: "",
        addKeys: [13,9],
        removeKeys: [8],
        addOnBlur: true,
        onChange: function () {},
        onChangeInput: function () {},
        onBlur: function(){},
        onTagAdd: function(){},
        onTagRemove: function(){},
        transform: function(tag) { return tag.trim()}
      };
    },
    getInitialState: function(){
      var value = this.props.defaultValue.slice(0);
      return {
        value: value,
        tag: "",
        invalid: false
      };
    },
    // componentWillMount () {
    //   this.setState({
    //     tags: this.props.tags.slice(0)
    //   });
    // },
    componentWillUpdate: function(nextProps){
      if (!this.isUncontrolled() && this.isUncontrolled(nextProps)) {
        this.setState({ value: this.props.defaultValue.slice(0) });
      }
    },
    isUncontrolled (props) {
      props = props || this.props;
      return !props.value && !props.valueLink
    },
    getValueLink: function(){
      if(!isUncontrolled()) {
        return this.props.valueLink || {
          value: this.props.value,
          requestChange: this.props.onChange
        };
      }
      return {
        value: this.state.value,
        requestChange: function(tags){
          this.setState({
            value: tags
          });
          this.props.onChange(tags);
        }.bind(this)
      }
    },

    validate: function(tag){
      var valueLink = this.getValueLink();
      return tag !== "" && valueLink.value.indexOf(tag) === -1;
    },

    getTags () {
      // return this.state.tags
      var  valueLink = this.getValueLink();
      return valueLink.value;
    },

    onChange(event) {
      this.props.onChangeInput(event.target.value)
      this.setState({
        tag: event.target.value,
        invalid: false
      });
    },

    onKeyDown(e){
      var valueLink = this.getValueLink();
      var add = this.props.addKeys.indexOf(e.keyCode) !== -1;
      var remove = this.props.removeKeys.indexOf(e.keyCode) !== -1
      if(add){ // tab enter按键新增tab
        e.preventDefault();
        this.addTag(this.state.tag.trim());
      }

      if(remove && valueLink.value.length > 0 && this.state.tag === ""){
        this.removeTag(valueLink.value[valueLink.value.length - 1]);
      }
    },

    onBlur: function (e){
      if(this.props.addOnBlur){
        this.addTag(this.state.tag.trim());
      }
      this.props.onBlur();
    },

    focus: function() {
      this.refs.input.getDOMNode().focus()
    },

    addTag(tag){
      var valueLink = this.getValueLink();
      var validate = this.props.validate || this.validate;

      var newTag = this.props.transform(tag)

      tag = typeof newTag === "string" ? newTag : tag;

      if(!validate(tag)){
        return this.setState({
          invalid: true
        });
      }

      var newValue = valueLink.value.concat([tag]);
          valueLink.requestChange(newValue, tag);
      this.setState({
        tag: "",
        invalid: false,
      }, function(){
        this.focus();
        this.props.onTagAdd(tag);
      })
    },

    removeTag: function(tag){
      var valueLink = this.getValueLink();
      var clone = valueLink.value.concat([]);

      for(var i = 0; i < clone.length; ++i){
        if(clone[i] === tag){
          clone.splice(i,1);
          valueLink.requestChange(clone, tag);
          this.props.onTagRemove(tag);
          return
        }
      }
    },

    render: function(){
      var valueLink = this.getValueLink()
      var ns = this.props.classNamespace === ""? "": this.props.classNamespace+ "-";
      var tagNodes = valueLink.value.map(function(tag,i){
        return React.createElement(Tag, {
          key: i,
          tag: tag,
          ns: ns,
          remove: this.removeTag.bind(null, tag)
        });
      }.bind(this));
      return (
        React.createElement("div" ,{
          className: ns+"tagsinput"
        }, tagNodes, React.createElement(Input, {
          ref: "input",
          placeholder: this.props.placeholder,
          value: this.state.tag,
          invalid: this.state.invalid,
          onKeyDown: this.onKeyDown,
          onChange: this.onChange,
          onBlur: this.onBlur,
          ns
        }))
      );
    }
  });
  return TagsInput;
}))
