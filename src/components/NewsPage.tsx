import React from 'react';
import { News } from '../types';

interface NewsPageProps {
  newsList: News[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ newsList }) => {
  const goodNews = newsList.filter(n => n.type === 'good');
  const badNews = newsList.filter(n => n.type === 'bad');
  const neutralNews = newsList.filter(n => n.type === 'neutral');

  const NewsCard = ({ title, news, type }: { title: string; news: News[]; type: 'good' | 'bad' | 'neutral' }) => {
    const borderColor = type === 'good' ? '#3fb950' : type === 'bad' ? '#f85149' : '#58a6ff';
    const icon = type === 'good' ? '📈' : type === 'bad' ? '📉' : '📰';

    return (
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>
            <span style={styles.cardIcon}>{icon}</span>
            {title}
          </div>
        </div>
        <div style={styles.newsList}>
          {news.length === 0 ? (
            <div style={styles.emptyState}>暂无新闻</div>
          ) : (
            news.map(item => (
              <div
                key={item.id}
                style={{
                  ...styles.newsItem,
                  borderLeftColor: borderColor
                }}
              >
                <div style={styles.newsDate}>{item.date}</div>
                <div style={styles.newsTitle}>{item.title}</div>
                <div style={styles.newsContent}>{item.content}</div>
                {item.relatedStock && (
                  <div style={styles.relatedStock}>
                    相关股票：{item.relatedStock}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.columns}>
        <NewsCard title="利好新闻" news={goodNews} type="good" />
        <NewsCard title="利空新闻" news={badNews} type="bad" />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden'
  },
  columns: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    height: '100%',
    overflow: 'hidden'
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    overflow: 'hidden'
  },
  cardHeader: {
    background: '#21262d',
    borderBottom: '1px solid #30363d',
    padding: '16px 20px'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px'
  },
  cardIcon: {
    fontSize: '16px'
  },
  newsList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px'
  },
  newsItem: {
    background: '#21262d',
    borderRadius: '10px',
    padding: '12px 14px',
    marginBottom: '10px',
    borderLeft: '3px solid',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateX(2px)'
    }
  },
  newsDate: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  newsTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '2px'
  },
  newsContent: {
    fontSize: '12px',
    color: '#8b949e',
    lineHeight: 1.5
  },
  relatedStock: {
    marginTop: '6px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#58a6ff'
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#6e7681',
    padding: '32px',
    fontSize: '14px'
  }
};
