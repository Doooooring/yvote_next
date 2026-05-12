import { NewsInView, NewsType } from '@utils/interface/news';

import BillNewsLayout from './bill';
import BudgetNewsLayout from './budget';
import CabinetNewsLayout from './cabinet';
import ConstitutionNewsLayout from './constitution';
import DebateNewsLayout from './debate';
import DefaultNewsLayout from './default';
import DiplomatNewsLayout from './diplomat';
import EconomicsNewsLayout from './economics';
import ElectionNewsLayout from './election';
import ExecutiveNewsLayout from './executive';
import GovernNewsLayout from './govern';
import InvestigationNewsLayout from './investigation';
import OthersNewsLayout from './others';
import PlenaryNewsLayout from './plenary';
import WeeklyNewsLayout from './weekly';

export function renderNewsByType(news: NewsInView) {
  switch (news.newsType) {
    case NewsType.bill:
      return <BillNewsLayout news={news} />;
    case NewsType.budget:
      return <BudgetNewsLayout news={news} />;
    case NewsType.cabinet:
      return <CabinetNewsLayout news={news} />;
    case NewsType.constitution:
      return <ConstitutionNewsLayout news={news} />;
    case NewsType.debate:
      return <DebateNewsLayout news={news} />;
    case NewsType.diplomat:
      return <DiplomatNewsLayout news={news} />;
    case NewsType.economics:
      return <EconomicsNewsLayout news={news} />;
    case NewsType.election:
      return <ElectionNewsLayout news={news} />;
    case NewsType.executive:
      return <ExecutiveNewsLayout news={news} />;
    case NewsType.govern:
      return <GovernNewsLayout news={news} />;
    case NewsType.investigation:
      return <InvestigationNewsLayout news={news} />;
    case NewsType.others:
      return <OthersNewsLayout news={news} />;
    case NewsType.plenary:
      return <PlenaryNewsLayout news={news} />;
    case NewsType.weekly:
      return <WeeklyNewsLayout news={news} />;
    default:
      return <DefaultNewsLayout news={news} />;
  }
}
