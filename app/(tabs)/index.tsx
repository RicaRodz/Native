import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { supabase } from "../../libs/supabase";

const { width } = Dimensions.get("window");

type Lesson = {
  id: string;
  title: string;
  level: string;
  type: string;
  media_url: string;
  created_at: string;
};

export default function HomeScreen() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const fetchLessons = async () => {
  console.log('⏳ Fetching lessons...')
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log('✅ Lessons:', data)
    setLessons(data ?? [])
    setError(null)
  } catch (err) {
    console.error('❗ Error caught:', err)
    if (err instanceof Error) setError(err.message)
    else setError(String(err))
  } finally {
    console.log('🏁 Fetch complete')
    setLoading(false)
  }
}


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLessons();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const getLevelColor = (level: string): string => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "#10B981";
      case "intermediate":
        return "#F59E0B";
      case "advanced":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type?.toLowerCase()) {
      case "video":
        return "🎥";
      case "article":
        return "📝";
      case "tutorial":
        return "🛠️";
      case "course":
        return "📚";
      default:
        return "📘";
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={isDark ? ["#1F2937", "#111827"] : ["#667EEA", "#764BA2"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Spanish 101</Text>
        <Text style={styles.headerSubtitle}>by Ricardo Rodriguez</Text>
      </LinearGradient>
    </View>
  );

  const renderLessonCard = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isDark && styles.cardDark,
        { transform: [{ scale: 1 }] },
      ]}
      onPress={() => Linking.openURL(item.media_url)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeIconContainer}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
        </View>
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: getLevelColor(item.level) },
          ]}
        >
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
      </View>

      <Text style={[styles.lessonTitle, isDark && styles.textLight]}>
        {item.title}
      </Text>

      <View style={styles.metaContainer}>
        <Text style={[styles.metaText, isDark && styles.metaDark]}>
          {item.type} • {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          style={styles.actionButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.actionButtonText}>Download Lesson →</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={[styles.emptyTitle, isDark && styles.textLight]}>
        No lessons yet
      </Text>
      <Text style={[styles.emptySubtitle, isDark && styles.metaDark]}>
        Check back later for new content
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667EEA" />
          <Text style={[styles.loadingText, isDark && styles.textLight]}>
            Loading lessons...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLessons}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkBackground]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLessonCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#667EEA"]}
            tintColor="#667EEA"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  darkBackground: {
    backgroundColor: "#0F172A",
  },
  listContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#E2E8F0",
    opacity: 0.9,
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1E293B",
    shadowColor: "#000",
    shadowOpacity: 0.3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  typeIcon: {
    fontSize: 18,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    lineHeight: 28,
  },
  textLight: {
    color: "#F8FAFC",
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  metaDark: {
    color: "#94A3B8",
  },
  cardFooter: {
    alignItems: "flex-start",
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#667EEA",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
});
