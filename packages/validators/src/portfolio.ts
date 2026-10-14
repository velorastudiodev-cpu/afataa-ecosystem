import { z } from 'zod';
const httpsUrl = z.string().url().refine(v => new URL(v).protocol === 'https:', 'Use an HTTPS URL');
export const ProfileSchema = z.object({
 fullName:z.string().min(1), roles:z.array(z.string()).min(1), headlineBadge:z.string(),
 heroTagline:z.string(), shortBio:z.string(), availabilityText:z.string(),
 calComLink:z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/), bookingVerified:z.boolean().default(false),
 socials:z.object({github:httpsUrl.nullable(),linkedin:httpsUrl.nullable(),instagram:httpsUrl.nullable(),whatsapp:httpsUrl.nullable(),discord:z.string().min(1).nullable(),zoom:httpsUrl.nullable(),email:z.string().email().nullable()})
});
export const AchievementSchema=z.object({id:z.string(),title:z.string(),organization:z.string(),year:z.number().int(),rankOrMedal:z.string(),highlightScore:z.string().optional(),description:z.string(),isGoldHighlight:z.boolean().default(true)});
export const MasterpieceSchema=z.object({id:z.string(),slug:z.string(),title:z.string(),subtitle:z.string(),category:z.enum(['FULLSTACK_ECOSYSTEM','AUTONOMOUS_CMS','WEB_PLATFORM','SOFTWARE_TOOL']),liveUrl:httpsUrl,pairedDashboardUrl:httpsUrl.optional(),repoUrl:httpsUrl.optional(),techStack:z.array(z.string()),summary:z.string(),technicalReportMdx:z.string(),featuredOrder:z.number(),isPublished:z.boolean().default(true),image:z.string(),embeddable:z.boolean(),report:z.array(z.object({heading:z.string(),body:z.string()}))});
export const PortfolioSchema=z.object({profile:ProfileSchema,achievements:z.array(AchievementSchema),masterpieces:z.array(MasterpieceSchema)});
export type Masterpiece=z.infer<typeof MasterpieceSchema>;
export type Profile=z.infer<typeof ProfileSchema>;
