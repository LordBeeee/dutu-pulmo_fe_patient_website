import { Link } from 'react-router-dom';
import type { NewsItem } from '@/constants/news-data';

type NewsCardProps = {
  item: NewsItem;
};

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Link to={`/news/${item.id}`} className="block group">
      <article className="bg-card-light rounded-2xl overflow-hidden border border-slate-100 cursor-pointer shadow-sm group-hover:shadow-lg transition-all h-full">
        <div className="aspect-video relative overflow-hidden">
          <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
          {item.badge && (
            <span className="absolute top-3 left-3 bg-blue-600/90 rounded-lg px-2 py-1 text-white text-[10px] font-bold">
              {item.badge}
            </span>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
          <div className="flex items-center text-slate-400 text-xs">
            <span className="material-icons-round text-sm mr-1">calendar_today</span>
            {item.date}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default NewsCard;
