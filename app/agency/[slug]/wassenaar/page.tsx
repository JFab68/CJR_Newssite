import { notFound } from "next/navigation";
import { Fragment } from "react";
import Link from "next/link";
import { agencyBySlug } from "@/lib/agencies";
import { getAgencyArchive } from "@/lib/agencyNews";
import { ItemList } from "@/components/AgencyParts";
import Sidebar from "@/components/Sidebar";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => [{ slug: "adcrr" }];
export const metadata = { title: "The Ricky Wassenaar case — ADCRR" };

type Src = [string, string];
const S = {
  mirror26: ["Arizona Mirror, Jan. 12, 2026", "https://azmirror.com/2026/01/12/confessed-prison-killer-ricky-wassenaar-finally-charged-in-april-murders-pleads-not-guilty/"],
  mirror25: ["Arizona Mirror, July 22, 2025", "https://azmirror.com/2025/07/22/he-confessed-to-killing-3-other-inmates-months-ago-the-doc-just-referred-charges-for-the-slayings/"],
  pnt: ["Phoenix New Times", "https://www.phoenixnewtimes.com/news/arizona-inmate-still-not-charged-for-killing-prisoners-april-22169651/"],
  abc15: ["ABC15, Apr. 7, 2025 (incl. ADCRR statement)", "https://www.abc15.com/news/local-news/investigations/how-one-of-arizonas-most-notorious-prisoners-was-able-to-kill-three-fellow-inmates"],
  kold: ["KOLD, Feb. 2004", "https://www.kold.com/story/1625663/inmates-in-prison-standoff-committed-crimes-in-tucson-area/"],
  appeal: ["State v. Wassenaar, Ariz. Ct. App. (2007)", "https://caselaw.findlaw.com/court/az-court-of-appeals/1311013.html"],
  nbc05: ["NBC News / AP, June 2005", "https://www.nbcnews.com/id/wbna8092449"],
  nbc04: ["NBC News / AP, Mar. 2004", "https://www.nbcnews.com/id/wbna4451992"],
  sj04: ["Sun Journal / AP, Mar. 5, 2004", "https://www.sunjournal.com/2004/03/05/report-standoff-faults-bad-decisions-arizona-prisons/"],
  coy: ["Sun Journal / AP, May 2, 2004", "https://www.sunjournal.com/2004/05/02/inmate-receives-seven-life-sentences/"],
  panel: ["Governor’s Blue Ribbon Panel report, Mar. 4, 2004 (Arizona Memory Project)", "https://azmemory.recollectcms.com/nodes/view/129933"],
  azfam: ["Arizona’s Family, May 11, 2026", "https://www.azfamily.com/2026/05/11/death-penalty-sought-against-confessed-tucson-prison-inmate-killer/"],
  notice: ["State’s notice of intent to seek death (DocumentCloud)", "https://www.documentcloud.org/documents/28113739-notice-of-death-wassenaar-final/"],
  kvoa: ["KVOA, Aug. 2026", "https://www.kvoa.com/news/local/trial-set-for-inmate-accused-of-killing-three-fellow-inmates-at-the-arizona-state-prison/article_cd01754f-3c44-47d1-84ab-637c012ede55.html"],
  vv: ["Village Voice, May 2025 (interview with Wassenaar)", "https://www.villagevoice.com/ricky-kurt-wassenaar-a-killer-for-trump/"],
} satisfies Record<string, Src>;

function Cite({ s }: { s: Src[] }) {
  return <sup className="cite">[{s.map((x, i) => <Fragment key={i}>{i ? ", " : ""}<a href={x[1]} target="_blank" rel="noopener noreferrer">{x[0]}</a></Fragment>)}]</sup>;
}
const P = ({ children, s }: { children: React.ReactNode; s: Src[] }) => <p>{children} <Cite s={s} /></p>;

export default async function Wassenaar({ params }: { params: { slug: string } }) {
  const a = agencyBySlug(params.slug); if (!a) notFound();
  const items = (await getAgencyArchive(a)).filter((i) => /wassenaar|15-day (prison )?standoff|lewis.*(standoff|hostage)|tucson prison.*(kill|death)/i.test(i.title));
  return (
    <div className="layout">
      <article className="deep-dive">
        <header className="page-h">
          <p className="eyebrow"><Link href="/agency">Agency Watch</Link> · <Link href="/agency/adcrr">ADCRR</Link> · <Link href="/agency/adcrr/history">History</Link></p>
          <h1>The Ricky Wassenaar case</h1>
          <p>From a 15-day prison tower standoff in 2004 to three killings in a Tucson prison in 2025, and a fourth killing he says he committed that the state says never happened. Every fact below links to its source. Commentary is labeled and kept separate.</p>
        </header>

        <h2 className="section-h">1. Before 2004</h2>
        <P s={[S.kold, S.mirror26]}>Wassenaar was first arrested in 1986, for armed robbery and aggravated assault, and served about ten years. KOLD reported that he had been out only 35 days when he robbed Tucson’s Empress Theater; the Arizona Mirror describes it as a Tucson video store and puts the time out at about four and a half months. Either way, the robbery ended in a high-speed police chase and crash. KOLD reported that he fired at officers during the chase and was wearing an electronic monitor when caught.</P>
        <P s={[S.appeal, S.nbc05, S.kold]}>That 1997 case brought a 28-year sentence for armed robbery and assault, which he was serving at the Lewis prison complex in Buckeye. KOLD reported a prison disciplinary record that included gambling, fighting, disobeying orders and drug possession.</P>
        <p className="tl-note">Uncertain: sources disagree on how long he was free before the 1997 robbery (35 days per KOLD in 2004, about 4½ months per the Arizona Mirror in 2026). We have not found court records from his 1986 or 1997 cases.</p>

        <h2 className="section-h">2. The 2004 Lewis prison tower standoff</h2>
        <P s={[S.appeal]}>Early on Jan. 18, 2004, Wassenaar and Steven Coy tried to escape from the Morey Unit at ASPC-Lewis. Armed with homemade knives, they overpowered a corrections officer and a civilian kitchen worker. Wassenaar shaved, put on the officer’s uniform, and was buzzed into a guard tower because on the security monitor he looked like an officer. Inside, he struck one officer with a metal kitchen paddle, subdued a second, a woman, and handcuffed both.</P>
        <P s={[S.sj04, S.nbc05, S.coy, S.appeal]}>The standoff lasted 15 days, one of the longest prison hostage standoffs in U.S. history. Officer Jason Auch was released Jan. 24. The female officer, who was sexually assaulted during her captivity (both men were later convicted of it), was released Feb. 1, when both men surrendered. Coy also raped the female kitchen worker.</P>
        <p className="tl-note">The often-repeated label “the longest prison standoff in U.S. history” is phrased by AP as “one of the longest”; we have not found an authoritative ranking.</p>

        <h2 className="section-h">3. Prosecution and sentencing</h2>
        <P s={[S.coy, S.nbc05]}>Coy pleaded guilty in March 2004 to 14 charges, including sexual assault, kidnapping and escape, and received seven more life terms. He was sent to serve them in Maine, where he grew up.</P>
        <P s={[S.nbc05, S.appeal]}>Wassenaar represented himself at trial. In 2005 a jury convicted him of 19 counts, including kidnapping, sexual assault, aggravated assault and first-degree escape, and acquitted him of attempted second-degree murder. He was sentenced to 16 consecutive life terms plus 25 concurrent years and ordered to pay more than $620,000 in restitution. He said his goal had been a transfer to Michigan to be closer to his mother.</P>

        <h2 className="section-h">4. The reviews that followed</h2>
        <P s={[S.nbc04, S.sj04, S.panel]}>Gov. Janet Napolitano appointed a Blue Ribbon Panel. Its March 2004 preliminary report made 68 recommendations and found the crisis grew out of “a series of small but critical gaps in security,” made worse by complacency, chronic legislative underfunding, staff shortages, inadequate training and poor morale. One officer was supervising 19 prisoners in the kitchen. Half of the prison’s 800-plus officers had two years or less on the job, and 14 of the 20 on duty that morning had less than one year. The department had stopped doing operational audits of its prisons in 2000.</P>
        <P s={[S.nbc04, S.sj04]}>Warden William Gaspar was demoted and eight supervisors were reassigned. The recommendations included more training, higher-resolution cameras, and major changes to the classification and segregation system.</P>
        <p className="tl-note">Open question: we have not yet found a public accounting of which of the 68 recommendations ADCRR actually carried out.</p>

        <h2 className="section-h">5. Two decades in custody</h2>
        <P s={[S.mirror26, S.mirror25]}>Wassenaar was first moved out of state, to Ohio and later New Mexico, and returned to Arizona in 2016. According to the Mirror, he lived alone in a cell for about 20 years. His security level was later lowered from maximum to close custody, which ended his solitary housing. Because of his sexual-assault conviction, he was placed in a sex-offender unit at ASPC-Tucson.</P>

        <h2 className="section-h">6. The killing the state says didn’t happen: Joseph Desisto, November 2024</h2>
        <P s={[S.mirror25, S.abc15]}>Wassenaar said he objected to getting a cellmate, even lying down to block the cell door, and told officials and the advocate Donna Hamm of Middle Ground Prison Reform that he would kill anyone placed with him. On Nov. 5, 2024, he told officers that his new cellmate, 81-year-old Joseph Desisto, was dead. He says he strangled Desisto with an arm bar and then his hands.</P>
        <P s={[S.abc15]}><strong>Who doubts it:</strong> ADCRR. In a statement to ABC15, the department said it had “no reason to believe” Wassenaar was involved, that he had sought emergency medical help for Desisto, and that the Pima County Office of the Medical Examiner attributed the death to natural causes from underlying health conditions and found no injuries consistent with trauma, including the method Wassenaar described. ADCRR said that on that basis it “treated and classified Wassenaar according to policy.” In other words, he stayed in a unit where he could be given another cellmate.</P>
        <P s={[S.mirror25, S.mirror26]}>No charge was filed. The Mirror explains that a confession alone cannot support a prosecution without <em>corpus delicti</em>, independent evidence that a crime occurred. Wassenaar has said his DNA should have been all over the body. Hamm told ABC15 she was skeptical at first but became convinced as he kept repeating the details.</P>
        <p className="tl-note">Uncertain: Sources describe the autopsy differently. ADCRR says it found natural causes, the Mirror says it “could not confirm” a homicide, and the Village Voice cites the Mirror as calling it “inconclusive.” We have not seen the autopsy report. We are not aware of any reinvestigation of Desisto’s death after the April 2025 killings. <Cite s={[S.abc15, S.mirror25, S.vv]} /></p>

        <h2 className="section-h">7. April 4, 2025: three men killed at ASPC-Tucson</h2>
        <P s={[S.mirror26, S.mirror25]}>That morning, staff placed Saul Alvarez in Wassenaar’s cell. Alvarez was serving time for kidnapping, raping and killing a teenage girl. Wassenaar says he suffocated and strangled Alvarez. He then took a rock in a mesh laundry bag to a fenced area where prisoners were waiting to enter the dining hall and killed Thorne Harnage and Donald Lashley, both convicted of sex crimes against children, and injured another man. He called the Arizona Mirror and a Phoenix TV station to brag about the killings: “I wanted to kill them all.” He says he had warned officials before Alvarez was moved in.</P>

        <h2 className="section-h">8. The slow road to charges</h2>
        <P s={[S.mirror25, S.mirror26]}>ADCRR found Wassenaar guilty of three murders on his prison disciplinary record but did not refer the case to the Pima County Attorney’s Office until late June 2025, nearly three months later. Pima County Attorney Laura Conover declared a conflict because her office had prosecuted at least two of the victims, and the case went to Pinal County.</P>
        <P s={[S.mirror26]}>A Pinal grand jury indicted him on Oct. 10, 2025, on three counts of first-degree murder and one count of dangerous or deadly assault by a prisoner. The indictment came so quietly that Wassenaar was still asking Hamm that month what was taking so long. He pleaded not guilty on Dec. 18, 2025.</P>
        <P s={[S.azfam, S.notice, S.kvoa]}>On May 11, 2026, Pinal County Attorney Brad Miller filed notice that he will seek the death penalty, citing Wassenaar’s “extensive history of violence.” Trial is set for Jan. 25 to March 27, 2028.</P>

        <h2 className="section-h">What ADCRR knew: the oversight record</h2>
        <ul>
          <li>Wassenaar told officials and an outside advocate that he would kill any cellmate. <Cite s={[S.mirror25]} /></li>
          <li>After a cellmate died in his cell and he confessed to killing him, ADCRR kept classifying him “according to policy,” relying on the medical examiner’s findings. <Cite s={[S.abc15]} /></li>
          <li>Five months later, staff placed another man in his cell, and three men died that morning. <Cite s={[S.mirror26]} /></li>
          <li>The prosecutor referral took nearly three months, even though ADCRR had already found him guilty on his disciplinary record. <Cite s={[S.mirror26]} /></li>
          <li>The 2004 panel had already warned about gaps in classification, segregation and auditing. <Cite s={[S.nbc04]} /></li>
        </ul>

        <section className="commentary">
          <h2 className="section-h">Commentary <small>Praxis Initiative perspective: opinion, not reporting</small></h2>
          <p>This case is not a story about one man. It is a story about a system that was warned twice. In 2004 a governor’s panel found that small, ignored gaps in security and classification can turn into catastrophe. Twenty years later, a man with that history told the department he would kill a cellmate. One cellmate died, and the department accepted the official finding and moved on. Five months later it placed another man in his cell, and three people died.</p>
          <p>Every person in state custody, whatever their conviction, is owed safety by the state that holds them. When the department’s own findings sat for nearly three months before reaching a prosecutor, and the public learned what happened mainly because the killer called reporters, that is a transparency failure, not a technicality. This is exactly why Arizona needs a funded, independent correctional oversight office that can see classification decisions, housing assignments and death investigations as they happen, not years later.</p>
        </section>

        <h2 className="section-h">Open questions</h2>
        <ul>
          <li>What exactly did the Desisto autopsy conclude, and has anyone reopened it?</li>
          <li>Who approved lowering Wassenaar’s custody level and assigning him cellmates, and what did they know about his threats?</li>
          <li>Why did the referral to prosecutors take until late June 2025?</li>
          <li>Which of the 2004 panel’s 68 recommendations are still in force?</li>
        </ul>

        <h2 className="section-h">Coverage archive <small>{items.length} stories</small></h2>
        <ItemList items={items} />
      </article>
      <Sidebar />
    </div>
  );
}
