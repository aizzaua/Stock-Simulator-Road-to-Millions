import { News, Stock } from '../types';
import { randomChoice, randomId } from '../utils/random';

const GOOD_NEWS_TEMPLATES = [
  { title: '{name}发布突破性产品', content: '公司宣布推出一款革命性新产品，市场反应热烈，预计将大幅提升营收。', impact: 0.05 },
  { title: '{name}业绩超预期', content: '最新季度财报显示，公司营收和利润均大幅超出分析师预期。', impact: 0.04 },
  { title: '{name}获得大额订单', content: '公司宣布与多家企业签订重大合同，总金额创下历史新高。', impact: 0.035 },
  { title: '{name}技术突破', content: '研发团队取得重大技术突破，相关专利已获得授权。', impact: 0.045 },
  { title: '{name}战略合作', content: '公司宣布与行业龙头达成战略合作，双方将在多个领域展开深度合作。', impact: 0.03 },
  { title: '{name}政策利好', content: '国家出台利好政策，公司所在行业将迎来重大发展机遇。', impact: 0.035 },
  { title: '{name}机构增持', content: '多家知名机构投资者大幅增持公司股票，看好长期发展前景。', impact: 0.025 },
  { title: '{name}产品热销', content: '公司最新产品市场销售火爆，销量连续多个月创新高。', impact: 0.03 }
];

const BAD_NEWS_TEMPLATES = [
  { title: '{name}业绩不及预期', content: '公司发布业绩预警，预计本季度营收将低于市场预期。', impact: -0.05 },
  { title: '{name}高管变动', content: '公司核心高管因个人原因辞职，市场对公司战略连续性表示担忧。', impact: -0.035 },
  { title: '{name}面临诉讼', content: '公司因相关问题被起诉，可能面临巨额赔偿。', impact: -0.045 },
  { title: '{name}政策利空', content: '监管部门出台新规，对公司业务将产生不利影响。', impact: -0.04 },
  { title: '{name}竞争加剧', content: '竞争对手推出颠覆性产品，市场份额面临挑战。', impact: -0.03 },
  { title: '{name}供应链问题', content: '公司供应链出现问题，可能影响产品交付和营收。', impact: -0.035 },
  { title: '{name}机构减持', content: '多家机构投资者大幅减持公司股票，引发市场担忧。', impact: -0.025 },
  { title: '{name}产品召回', content: '公司宣布部分产品召回，将对业绩产生一定影响。', impact: -0.03 }
];

const NEUTRAL_NEWS_TEMPLATES = [
  { title: '{name}参加行业展会', content: '公司携最新产品参加行业展会，展示技术实力。', impact: 0 },
  { title: '{name}发布年度报告', content: '公司发布年度社会责任报告，展现企业担当。', impact: 0 },
  { title: '{name}获得荣誉', content: '公司在行业评选中获得多项荣誉，品牌价值持续提升。', impact: 0.01 },
  { title: '{name}管理层调研', content: '公司管理层赴各地调研，了解市场一线情况。', impact: 0 }
];

export function generateNews(date: string, stocks: Stock[]): News[] {
  const news: News[] = [];
  const numNews = Math.floor(Math.random() * 3) + 1; // 1-3条新闻

  for (let i = 0; i < numNews; i++) {
    const stock = randomChoice(stocks);
    const rand = Math.random();
    let template;
    let type: 'good' | 'bad' | 'neutral';

    if (rand < 0.35) {
      template = randomChoice(GOOD_NEWS_TEMPLATES);
      type = 'good';
    } else if (rand < 0.7) {
      template = randomChoice(BAD_NEWS_TEMPLATES);
      type = 'bad';
    } else {
      template = randomChoice(NEUTRAL_NEWS_TEMPLATES);
      type = 'neutral';
    }

    news.push({
      id: randomId(),
      date,
      type,
      title: template.title.replace('{name}', stock.name),
      content: template.content.replace('{name}', stock.name),
      relatedStock: stock.code,
      impact: template.impact
    });
  }

  return news;
}
