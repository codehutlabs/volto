import React from 'react';
import ObjectBrowserBody from '@plone/volto/components/manage/Sidebar/ObjectBrowserBody';
import { getParentURL } from '@plone/volto/components/manage/Sidebar/ObjectBrowserBody';
import SidebarPopup from '@plone/volto/components/manage/Sidebar/SidebarPopup';

const withObjectBrowser = (WrappedComponent) =>
  class extends React.Component {
    /**
     * Default properties
     * @property {Object} defaultProps Default properties.
     * @static
     */
    static defaultProps = {
      onChangeBlock: () => {},
      data: {},
      block: new Date().getTime() + '',
    };

    constructor() {
      super();
      this.state = { isObjectBrowserOpen: false };
    }

    /**
     * openObjectBrowser
     * @function openObjectBrowser
     * @param {Object} object ObjectBrowser configuration.
     * @param {string} object.mode Quick mode, defaults to `image`. Values: link, image, multiple
     * @param {string} object.dataName Name of the block data property to write the selected item.
     * @param {string} object.onSelectItem Function that will be called on item selection.
     * @param {string} object.overlay Boolean to show overlay background on content when opening objectBrowser.
     *
     * Usage:
     *
     * this.props.openObjectBrowser();
     *
     * this.props.openObjectBrowser({mode: 'link'});
     *
     * this.props.openObjectBrowser({
     *   dataName: 'myfancydatafield'
     *   });
     *
     * this.props.openObjectBrowser({
     *   onSelectItem: url =>
     *     this.props.onChangeBlock(this.props.block, {
     *       ...this.props.data,
     *       myfancydatafield: url,
     *     }),
     *   });
     */
    openObjectBrowser = ({
      mode = 'image',
      onSelectItem = null,
      dataName = null,
      overlay = null,
      propDataName = null,
      selectableTypes,
      maximumSelectionSize,
    } = {}) =>
      this.setState(() => ({
        isObjectBrowserOpen: true,
        mode,
        onSelectItem,
        dataName,
        overlay,
        propDataName,
        selectableTypes,
        maximumSelectionSize,
      }));

    closeObjectBrowser = () => this.setState({ isObjectBrowserOpen: false });

    render() {
      let contextURL = this.props.pathname ?? this.props.location?.pathname;
      if (contextURL?.endsWith('edit')) {
        contextURL = getParentURL(contextURL);
      }
      return (
        <>
          <WrappedComponent
            {...this.props}
            isObjectBrowserOpen={this.state.isObjectBrowserOpen}
            openObjectBrowser={this.openObjectBrowser}
            closeObjectBrowser={this.closeObjectBrowser}
          />

          <>
            <SidebarPopup
              open={this.state.isObjectBrowserOpen}
              onClose={this.closeObjectBrowser}
              overlay={this.state.overlay}
            >
              <ObjectBrowserBody
                {...this.props}
                data={
                  this.state.propDataName
                    ? this.props[this.state.propDataName]
                    : { ...this.props.data, contextURL }
                }
                closeObjectBrowser={this.closeObjectBrowser}
                mode={this.state.mode}
                onSelectItem={this.state.onSelectItem}
                dataName={this.state.dataName}
                selectableTypes={this.state.selectableTypes}
                maximumSelectionSize={this.state.maximumSelectionSize}
              />
            </SidebarPopup>
          </>
        </>
      );
    }
  };
export default withObjectBrowser;
