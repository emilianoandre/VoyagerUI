import { BugSystem } from './bug-system';
import { RuleManager } from './rule-manager';

/**
 * Project Class
 * @author: EAndre
 */
export class Project {
    idProject : number;
    name: string;
    bugSystem: BugSystem;
    ruleManager: RuleManager;
}