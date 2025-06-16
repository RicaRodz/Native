import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { supabase } from '../../libs/supabase'

export default function HomeScreen() {
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  useEffect(() => {
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) setError(error.message)
      else setLessons(data)

      setLoading(false)
    }

    fetchLessons()
  }, [])

  if (loading) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#333'} />
        <Text style={[styles.loadingText, isDark && styles.textLight]}>
          Loading lessons...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <Text style={[styles.errorText, isDark && styles.textLight]}>
          Error: {error}
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <Text style={[styles.header, isDark && styles.textLight]}>📘 Latest Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.lessonTitle, isDark && styles.textLight]}>
              {item.title}
            </Text>
            <Text style={[styles.meta, isDark && styles.metaDark]}>
              {item.level} • {item.type}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL(item.media_url)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>View Lesson</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#111',
  },
  textLight: {
    color: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  card: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1f1f1f',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  metaDark: {
    color: '#aaa',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
