import React, { useState, memo, useMemo, useCallback } from "react";
import useTitle from "react-use/lib/useTitle";
import { RouteComponentProps } from "react-router-dom";
import Breadcrumbs from "components/Breadcrums";
import Tabs from "components/Tabs";
import RenderIf from "react-rainbow-components/components/RenderIf";
import Button from "react-rainbow-components/components/Button";
import CreateCampaign from "pages/Elections/CreateCampaign";
import ContentLoader from "components/ContentLoader";
import TabSettings from "pages/Elections/EditElection/TabSettings";
import TabVoters from "pages/Elections/EditElection/TabVoters";
import TabCandidates from "pages/Elections/EditElection/TabCandidates";
import TabCampaigns from "pages/Elections/EditElection/TabCampaigns";
import TabGeneral from "pages/Elections/EditElection/TabGeneral";
import useElection, { PropsUseElection } from "hooks/useElection";
import TheElectionProvider from "context/TheElectionContext";
import { resolveValueType } from "utils/properTypes";
import { TypeElection } from "types/electionTypes";
import "./index.css";

const tabs = [
  { id: "general", name: "General" },
  { id: "campaigns", name: "Partidos" },
  { id: "votantes", name: "Votantes" },
  { id: "candidates", name: "Candidatos" },
  { id: "configs", name: "Configuraciones" }
];

const confApi = (id: string): PropsUseElection => {
  return {
    dataType: "object",
    dataUrl: `/elections/${id}`,
    createUrl: `/elections/${id}`,
    removeUrl: `/elections/${id}`,
    updateUrl: `/elections/${id}`
  };
};

type PropsEditElection = RouteComponentProps<{ id: string }> & {};

export default memo(function EditElection({ match, staticContext, location, history }: PropsEditElection) {
  const currentElectionId = useMemo(() => match.params.id, [match]);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isOpenCreateCampaign, openCampaignModal] = useState<boolean>(false);
  const [editableCampaign, setEditableCampaign] = useState<string | null>(null);

  const { apiRemove, apiUpdate, isFetching, isFetchError, data, api } = useElection(confApi(currentElectionId));

  const election = resolveValueType<TypeElection>(data, "object") as TypeElection | null;

  useTitle(election ? election.name : ". . .");

  const breadcrumbs = useMemo(
    () => [
      { name: "Elecciones", pathname: "/elections" },
      { name: election ? election.name : "...", pathname: `/elections/${currentElectionId}` }
    ],
    [election, currentElectionId]
  );

  const updateElection = useCallback(apiUpdate, [apiUpdate]);
  const isActiveElection = election ? election.status === "active" : false;

  if (!election) {
    return <ContentLoader messageNoData='Elemento no existente' contentScreen='elections' isError={isFetchError} isFetching={isFetching} isNoData={false} />;
  } else if (Object.keys(election).length === 0) {
    return <ContentLoader messageNoData='Elemento no existente' contentScreen='elections' isError={null} isFetching={false} isNoData={true} />;
  }

  return (
    <TheElectionProvider id={currentElectionId} mutate={api.mutate} value={election}>
      <Breadcrumbs history={history} match={match} location={location} staticContext={staticContext} breadcrumbs={breadcrumbs} />
      <RenderIf isTrue={isOpenCreateCampaign}>
        <CreateCampaign
          slug={editableCampaign}
          createOrUpdate={updateElection}
          cancel={() => {
            setEditableCampaign(null);
            return openCampaignModal(false);
          }}
        />
      </RenderIf>
      <RenderIf isTrue={!isOpenCreateCampaign}>
        <ContentLoader messageNoData='No existe' contentScreen='elections' isError={isFetchError} isFetching={isFetching} isNoData={Boolean(Object.keys(election).length <= 0)}>
          {
            <Tabs initialTab={selectedTab} onSelectTab={setSelectedTab} tabs={tabs}>
              <RenderIf isTrue={selectedTab === 0}>
                <TabGeneral updateElection={updateElection} />
              </RenderIf>
              <RenderIf isTrue={selectedTab === 1 && !isActiveElection}>
                <TabCampaigns
                  updateElection={updateElection}
                  editCampaign={slug => {
                    setEditableCampaign(slug);
                    return openCampaignModal(true);
                  }}
                />
              </RenderIf>
              <RenderIf isTrue={selectedTab === 2 && !isActiveElection}>
                <TabVoters updateElection={updateElection} />
              </RenderIf>
              <RenderIf isTrue={selectedTab === 3 && !isActiveElection}>
                <TabCandidates />
              </RenderIf>
              <RenderIf isTrue={selectedTab === 4}>
                <TabSettings updateElection={updateElection} />
              </RenderIf>
              <RenderIf isTrue={selectedTab !== 4 && selectedTab !== 0 && isActiveElection}>
                <p>Desactivado durante las elecciones</p>
              </RenderIf>
            </Tabs>
          }
          <div className='rainbow-m-top_xx-large rainbow-align-content_center rainbow-flex_wrap'>
            <Button
              variant='destructive'
              label='Borrar Elección'
              disabled={isActiveElection}
              className='rainbow-m-horizontal_medium'
              onClick={() => apiRemove(null, () => history.push("/elections"))}
            />
          </div>
        </ContentLoader>
      </RenderIf>
    </TheElectionProvider >
  );
});
