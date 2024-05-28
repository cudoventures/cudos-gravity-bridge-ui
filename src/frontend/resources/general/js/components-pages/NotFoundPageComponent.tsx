/* global TR */

import React from "react";

import ContextPageComponent, {
  ContextPageComponentProps,
} from "./common/ContextPageComponent";

import "./../../css/components-pages/page-not-found-component.css";
import LayoutBlock from "../../../common/js/components-inc/LayoutBlock";
import Actions from "../../../common/js/components-inc/Actions";
import Button from "../../../common/js/components-inc/Button";
import Checkbox from "../../../common/js/components-inc/Checkbox";
import Input from "../../../common/js/components-inc/Input";
import Select from "../../../common/js/components-inc/Select";
import SelectSearchable from "../../../common/js/components-inc/SelectSearchable";
import Tooltip from "../../../common/js/components-inc/Tooltip";
import Popover from "../../../common/js/components-inc/Popover";
import DatepickerComponent from "../../../common/js/components-core/Datepicker";
import { MenuItem } from "@material-ui/core";
import PageComponent from "../../../common/js/components-pages/PageComponent";
import { inject, observer } from "mobx-react";

interface Props extends ContextPageComponentProps {}

export default class PageNotFoundComponent extends ContextPageComponent<Props> {
  static layout() {
    const MobXComponent = inject("appStore")(observer(PageNotFoundComponent));
    PageComponent.layout(<MobXComponent />);
  }

  anchorEl: any;
  checkbox: 0 | 1;
  datepicker: number;

  constructor(props: Props) {
    super(props);
    this.anchorEl = null;
    this.checkbox = 1;
    this.datepicker = Date.now();
  }

  getPageLayoutComponentCssClassName() {
    return "PageNotFound";
  }

  renderContent() {
    return (
      <div
        style={{ width: "1000px", height: "500px", margin: "auto" }}
        className={"FlexSingleCenter"}
      >
        <LayoutBlock>
          <LayoutBlock direction={LayoutBlock.DIRECTION_ROW}>
            <Input label={"test"} />

            <Input label={"test"} error />
          </LayoutBlock>

          <LayoutBlock direction={LayoutBlock.DIRECTION_ROW}>
            <Select label={"test"}>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>

            <Select label={"test"} error>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
            </Select>
          </LayoutBlock>

          <LayoutBlock direction={LayoutBlock.DIRECTION_ROW}>
            <SelectSearchable
              label={"test"}
              multiple={true}
              options={[
                SelectSearchable.option(1, "value 1"),
                SelectSearchable.option(2, "value 2"),
              ]}
            />

            <SelectSearchable
              label={"test"}
              error
              options={[
                SelectSearchable.option(1, "value 1"),
                SelectSearchable.option(2, "value 2"),
              ]}
            />
          </LayoutBlock>

          <Tooltip title={"some info"} arrow>
            <span>Value</span>
          </Tooltip>

          <Checkbox
            onChange={() => {
              this.checkbox ^= 1;
              this.setState({});
            }}
            value={this.checkbox}
            label={<div>'some text'</div>}
          />

          <Actions>
            <Button type={Button.TYPE_ROUNDED} color={Button.COLOR_SCHEME_1}>
              button 01
            </Button>
            <Button type={Button.TYPE_ROUNDED} color={Button.COLOR_SCHEME_2}>
              button 02
            </Button>
            <Button
              type={Button.TYPE_TEXT_INLINE}
              color={Button.COLOR_SCHEME_1}
            >
              button 03
            </Button>
            <Button
              type={Button.TYPE_TEXT_INLINE}
              color={Button.COLOR_SCHEME_2}
            >
              button 04
            </Button>
          </Actions>

          <span
            onClick={e => {
              this.anchorEl = e.target;
              this.setState({});
            }}
          >
            Popover
          </span>
          <Popover
            anchorEl={this.anchorEl}
            open={this.anchorEl !== null}
            onClose={() => {
              this.anchorEl = null;
              this.setState({});
            }}
          >
            some content
          </Popover>

          <DatepickerComponent
            className={"DatepickerComponent"}
            showMonthDropdown={true}
            showYearDropdown={true}
            selected={new Date()}
            onChange={e => {
              this.datepicker = e.getTime();
              this.setState({});
            }}
            customInput={
              <div> {new Date(this.datepicker).formatCalendarDate()} </div>
            }
          />
        </LayoutBlock>
      </div>
    );
  }
}
