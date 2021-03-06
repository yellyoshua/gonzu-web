import React, { useContext } from "react";
import CardCampaign from "components/Card/CardCampaign";
import { TheElectionContext, TheUpdateElectionContext } from "context/TheElectionContext";
import useParserData from "hooks/useParserData";
import { doubleArrRemoveItem } from "utils/parsersData";
import { TypeCampaignObj, TypeCandidateObj } from "types/electionTypes";

type PropsListCampaigns = {
  editCampaign: (slug: string | null) => void;
};

const { convertDoubleArrToObjArr } = useParserData();
export default function ListCampaigns({ editCampaign }: PropsListCampaigns) {
  const theElection = useContext(TheElectionContext)!;
  const [, updateElection] = useContext(TheUpdateElectionContext)!;

  const campaigns = convertDoubleArrToObjArr<TypeCampaignObj>(theElection.campaigns);
  const candidates = convertDoubleArrToObjArr<TypeCandidateObj>(theElection.candidates);

  return <div className="list-items-col">
    {campaigns.map((campaign, index) => {

      const listCandidates = candidates.filter((cnd) => {
        return cnd.campaign_slug === campaign.slug;
      });

      return <CardCampaign
        key={index}
        candidates={listCandidates}
        campaign={campaign}
        onRequestOpen={editCampaign}
        onRequestDelete={async slug => {
          return await updateElection(
            {
              campaigns: doubleArrRemoveItem(theElection.campaigns, "slug", slug),
              candidates: doubleArrRemoveItem(theElection.candidates, "campaign_slug", slug)
            }, () => { }
          );
        }}
      />
    })}
  </div>;
}