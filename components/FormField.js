import { useState } from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FormField({
  label,
  icon,
  multiline,
  keyboardType,
  placeholder,
  value,
  onChangeText,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputFocused]}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={19}
            color={focused ? '#6C63FF' : '#A49FE0'}
            style={styles.inputIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.textArea]}
          placeholder={placeholder}
          placeholderTextColor="#A49FE0"
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 5 : 1}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46DB',
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FF',
    borderWidth: 1.5,
    borderColor: '#E7E1F8',
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: '#6C63FF',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 14px rgba(99,102,241,0.18)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#2B2540',
  },
  textArea: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
});