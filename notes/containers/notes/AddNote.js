import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { addTask, setTitleNewNote, setBodyNewNote } from '../../requests/Requests';
import { styles } from '../../Styles';

const mapStateToProps = (state) => {
	return {
        id: state.task.present.id,
        task: state.task.present.task,
        error: state.task.present.error,
        titleNewNote: state.task.present.titleNewNote,
        bodyNewNote: state.task.present.bodyNewNote,
        canUndo: state.task.past.length > 0,
        canRedo: state.task.future.length > 0
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
        addTaskFromForm: (id, data) => dispatch(addTask(id, data)),
        setTitleNewNote: (titleNewNote) => dispatch(setTitleNewNote(titleNewNote)),
        setBodyNewNote: (bodyNewNote) => dispatch(setBodyNewNote(bodyNewNote)),
        onUndo: (e) => {
            e.preventDefault();
            dispatch(UndoActionCreators.undo());
        },
        onRedo: (e) => {
            e.preventDefault();
            dispatch(UndoActionCreators.redo());
        } 
	};
};

class AddNote extends Component {

  static propTypes = {
    id: PropTypes.string,
    addTaskFromForm: PropTypes.func.isRequired,
    task: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    titleNewNote: PropTypes.string.isRequired,
    bodyNewNote: PropTypes.string.isRequired,
    setTitleNewNote: PropTypes.func,
    setBodyNewNote: PropTypes.func
 }

 constructor(props) {
  super(props);
  this.state = {title: '',
    body: ''};
  this.onFieldChange = this.onFieldChange.bind(this);
}

 componentWillMount() {
  this.props.navigation.setParams({
      'onRight': this.onSaveNote,
      'onLeft': this.onClose
  })
}

onSaveNote() {
    let data = {
            title: this.refs.titleNote.value,
            body: this.refs.bodyNote.value
          };
      // TODO: переправить на нужную страницу
      this.props.addTaskFromForm(this.props.id, data)
}

onClose() {
  Alert.alert(
    'Is exit without saving?',
    '',
    [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'OK', onPress: () => Actions.replace('notes')},
    ],
    { cancelable: false }
  );
}

 onFieldChange(fieldName, e) {
  if (fieldName == 'titleField') {
    this.props.setTitleNewNote(e);
  } else  {
    this.props.setBodyNewNote(e);
  }
}

  render() {

    return (
      <View style={styles.container}>
        <TextInput
          autoFocus={true}
          onChangeText={this.onFieldChange.bind(this, 'titleField')} 
          placeholder='Заголовок'
          ref='email'
          value={this.props.titleNewNote}
        />
        <TextInput
          onChangeText={this.onFieldChange.bind(this, 'bodyField')}
          placeholder='Содержимое заметки'
          ref='password' 
          value={this.props.bodyNewNote}
        />
        <Button
          onPress={this.props.onUndo}
          title={'Отменить'}
          color="#007DDC"
          disabled={!this.props.canUndo}
        />
        <Button
          onPress={this.props.onRedo}
          title={'Повторить'}
          color="#007DDC"
          disabled={!this.props.canRedo}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNote);