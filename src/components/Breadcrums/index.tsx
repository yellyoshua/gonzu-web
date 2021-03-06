import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import BreadcrumbComponent from "react-rainbow-components/components/Breadcrumb";
import BreadcrumbsComponent from "react-rainbow-components/components/Breadcrumbs";

type PropsBreadcrumbs = RouteComponentProps & {
  breadcrumbs: {
    name: string;
    pathname: string;
  }[];
  className?: string;
};

function Breadcrumbs({ history, breadcrumbs, className }: PropsBreadcrumbs) {
  return (
    <div className='rainbow-p-around_large'>
      <BreadcrumbsComponent>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbComponent
            className={className}
            key={index}
            label={breadcrumb.name}
            onClick={() => history.push(breadcrumb.pathname)}
          />
        ))}
      </BreadcrumbsComponent>
    </div>
  );
}
export default withRouter(Breadcrumbs);