import { PortfolioSchema } from '@afataa/validators';
import source from './content.json';
export const content = PortfolioSchema.parse(source);
