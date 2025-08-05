import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

type MessageStatus = 'sending' | 'success' | 'error';

interface Message {
  id: number;
  content: string;
  status: MessageStatus;
  resultMessage: string;
}

const GAS_URL = 'https://script.google.com/macros/s/AKfycbySuZ-iUSj7voDVz-lsRY1pY7dkAKwVbWoLgmjPp5kac-fb_DZ8To4F4FN0CbzJPtuU/exec';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<TextInput>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      content: input,
      status: 'sending',
      resultMessage: '送信中...',
    };

    setMessages(prev => [newMessage, ...prev]);
    setInput('');
    Keyboard.dismiss();

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: newMessage.content,
      });

      const result = await response.json();

      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? {
                ...msg,
                status: result.status === 200 ? 'success' : 'error',
                resultMessage:
                  result.status === 200 ? `✅ ${result.message}` : `❌ エラー: ${result.message}`,
              }
            : msg,
        ),
      );
    } catch {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id
            ? { ...msg, status: 'error', resultMessage: '❌ 通信エラー' }
            : msg,
        ),
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.container}
        >
          <Text style={styles.title}>📩 メッセージ送信アプリ</Text>

          <TouchableOpacity style={styles.buttonTop} onPress={handleSend}>
            <Text style={styles.buttonText}>送信</Text>
          </TouchableOpacity>

          <View style={styles.inputCard}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="メッセージを入力"
              value={input}
              onChangeText={setInput}
              multiline
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={handleSend}
            />
          </View>

          <FlatList
            style={styles.list}
            data={messages}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => (
              <View
                style={[styles.messageBubble, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f7fa' }]}
              >
                <View style={styles.messageRow}>
                  <View style={styles.avatar}><Text>✉️</Text></View>
                  <View style={styles.messageContent}>
                    <Text style={styles.messageText}>{item.content}</Text>
                    <Text
                      style={[
                        styles.status,
                        item.status === 'success'
                          ? styles.success
                          : item.status === 'error'
                          ? styles.error
                          : styles.sending,
                      ]}
                    >
                      {item.resultMessage}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e9eff5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  inputCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    minHeight: 60,
    textAlignVertical: 'top',
    backgroundColor: '#fefefe',
  },
  buttonTop: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: { marginTop: 20 },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: '#d0e3ff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  messageContent: { flex: 1 },
  messageText: { fontSize: 16, marginBottom: 4, color: '#333' },
  status: { fontSize: 12 },
  success: { color: 'green' },
  error: { color: 'red' },
  sending: { color: 'orange' },
});

export default App;
