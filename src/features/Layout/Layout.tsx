import React, { useEffect, useState } from 'react'
import { IDapplet, IRawDapplet } from '../../models/dapplets'
import { ReactComponent as Loader } from '../../components/Notification/loader.svg'
import Header from './Header/Header'
import Overlay from './Overlay/Overlay'
import SidePanel from './SidePanel/SidePanel'
import styled from 'styled-components/macro'
import DappletList from './DappletList/DappletList'
import { Sort, SortTypes } from '../../models/sort'
import { RootDispatch, RootState } from '../../models'
import { connect } from 'react-redux'
import { Lists, MyListElement } from '../../models/myLists'
import { Modals } from '../../models/modals'
import getIconUrl from '../../api/getIconUrl'
import parseRawDappletVersion from '../../lib/parseRawDappletVersion'
import { MAX_MODULES_COUNTER, MODULE_TYPES, REGISTRY_BRANCHES } from '../../constants'
import dappletRegistry from '../../api/dappletRegistry'
import { TrustedUser } from '../../models/trustedUsers'

interface WrapperProps {
  isNotDapplet: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: grid;

  height: 100%;

  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 84px 1fr;

  grid-template-areas:
    'header header header'
    'sidePanel content overlay'
    ${({ isNotDapplet }) => `"sidePanel content ${!isNotDapplet ? 'overlay' : 'overlay'}"`};
`

/* probabaly need those again */
/* ${({ isNotDapplet }) =>
      isNotDapplet ? `455px` : "0"}; */

/* ${({ isSmall }) =>
      `"sidePanel content ${isSmall ? "content" : "overlay"}"`}; */

const StyledHeader = styled(Header)`
  grid-area: header;
`

const StyledSidePanel = styled(SidePanel)`
  grid-area: sidePanel;
`

const MainContent = styled.main`
  grid-area: content;

  padding: 0 !important;
  width: 100%;
`

const StyledOverlay = styled(Overlay)`
  grid-area: overlay;
`

const mapState = (state: RootState) => ({
  dapplets: Object.values(state.dapplets),
  sortType: state.sort.sortType,
  addressFilter: state.sort.addressFilter,
  searchQuery: state.sort.searchQuery,
  selectedList: state.sort.selectedList,
  isTrustedSort: state.sort.isTrustedSort,
  trigger: state.sort.trigger,
  address: state.user.address,
  trustedUsers: state.trustedUsers.trustedUsers,
  myLists: state.myLists,
})
const mapDispatch = (dispatch: RootDispatch) => ({
  setModalOpen: (payload: Modals) => dispatch.modals.setModalOpen(payload),
  setSort: (payload: Sort) => dispatch.sort.setSort(payload),
  setTrustedUsers: (payload: TrustedUser[]) => dispatch.trustedUsers.setTrustedUsers(payload),
  setMyList: (payload: { name: Lists; elements: MyListElement[] }) =>
    dispatch.myLists.setMyList(payload),
})

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

export interface LayoutProps {
  selectedList?: Lists
  setSelectedList: any
  trustedUsersList: TrustedUser[]
  setAddressFilter: any
  windowWidth: number
  isNotDapplet: boolean
  isListLoading: boolean
}

const Layout = ({
  setSelectedList,
  trustedUsersList,
  setAddressFilter,
  windowWidth,
  isNotDapplet,
  dapplets,
  sortType,
  addressFilter,
  searchQuery,
  selectedList,
  isTrustedSort,
  trigger,
  address,
  trustedUsers,
  myLists,
  setModalOpen,
  setSort,
  setTrustedUsers,
  setMyList,
  isListLoading,
}: LayoutProps & Props): React.ReactElement<LayoutProps> => {
  const localDappletsList = myLists[Lists.MyDapplets]
  const selectedDappletsList = myLists[Lists.MyListing]

  const [dappletsByList, setDappletsByList] = useState<IDapplet[]>([])
  // const [isListLoading, setIsListLoading] = useState(false);
  const [hexifiedAddressFilter, setHexifiedAddresFilter] = useState('')

  useEffect(() => {
    if (dapplets.length === 0) return

    if (addressFilter || selectedList === 'Selected dapplets') {
      const getModulesOfListing = async (addressFilter: string) => {
        // setIsListLoading(true);
        const offset = 0
        const limit = MAX_MODULES_COUNTER
        const listingAddress = addressFilter.startsWith('0x')
          ? addressFilter
          : await dappletRegistry.provider.resolveName(addressFilter)

        /* TMP dirt */
        if (listingAddress === null) throw new Error('The hex pair for this ENS does not exist')

        setHexifiedAddresFilter(listingAddress)

        const data = await dappletRegistry.getModulesOfListing(
          listingAddress,
          REGISTRY_BRANCHES.DEFAULT,
          offset,
          limit,
          false
        )

        const { modules } = data

        const rawDapplets = modules.filter(
          (module: IRawDapplet) => module.moduleType === MODULE_TYPES.DAPPLET
        )

        let { id: lastDappId } = dapplets.reduce((prev, current) => {
          const isNextDapp = current.id > prev.id
          return isNextDapp ? current : prev
        })

        // const publicList: IDapplet[] = [];
        const proms = rawDapplets.map(async (dapplet: IRawDapplet, i: number) => {
          const { name, description, title, icon } = dapplet

          const presentedDapplet = dapplets.find((presentedDapp) => presentedDapp.name === name)

          const isPresented = presentedDapplet !== undefined

          if (isPresented) {
            return presentedDapplet
          } else {
            const iconUrl = await getIconUrl(icon)

            const listers = await dappletRegistry.getListersByModule(name, offset, limit)

            const formatted: IDapplet = {
              id: lastDappId + 1,
              description: description,
              icon: iconUrl,
              name: name,
              owner: data.owners[i],
              title: title,
              versionToShow: parseRawDappletVersion(data.lastVersions[i].version),
              version: parseRawDappletVersion(data.lastVersions[i].version),
              /* TODO: timestamp to be implemented */
              timestampToShow: 'no info',
              timestamp: 'no info',
              listers: listers,
              isExpanded: false,
              interfaces: [],
            }

            lastDappId++
            return formatted
          }
        })

        const publicList = await Promise.all(proms)

        setDappletsByList(publicList)
        // setIsListLoading(false);
      }

      if (addressFilter) getModulesOfListing(addressFilter)
    } else if (selectedList === 'My dapplets') {
      /* TODO: won't work after pagination implemented, update ASAP */
      const selectedDappletNames = myLists[selectedList].map((dapp) => dapp.name)

      const localDapplets = dapplets.filter((dapp) => selectedDappletNames.includes(dapp.name))

      setDappletsByList(localDapplets)
    } else {
      setDappletsByList(dapplets)
    }
  }, [addressFilter, dapplets, myLists, selectedList])

  return (
    <Wrapper isNotDapplet={isNotDapplet}>
      <StyledHeader selectedList={selectedList} isNotDapplet={isNotDapplet} />

      {/* TMP LOADER */}
      {isListLoading ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(0, -50%)',
            padding: '10px',
          }}
        >
          <Loader width={50} height={50} className="notification-custom-animate" />
        </div>
      ) : (
        <>
          <StyledSidePanel
            localDappletsList={localDappletsList}
            selectedDappletsList={selectedDappletsList}
            setSelectedList={setSelectedList}
            trustedUsersList={trustedUsersList}
            setAddressFilter={setAddressFilter}
            dapplets={dapplets}
          />

          <MainContent>
            <DappletList
              // setIsListLoading={setIsListLoading}
              hexifiedAddressFilter={hexifiedAddressFilter}
              isListLoading={isListLoading}
              dapplets={dappletsByList}
              selectedDapplets={selectedDappletsList}
              localDapplets={localDappletsList}
              selectedList={selectedList}
              setSelectedList={(newSelectedList: Lists | undefined) =>
                setSort({ selectedList: newSelectedList, searchQuery: '' })
              }
              sortType={sortType || SortTypes.ABC}
              searchQuery={searchQuery || ''}
              editSearchQuery={(newtSearchQuery: string) =>
                setSort({ searchQuery: newtSearchQuery })
              }
              addressFilter={addressFilter || ''}
              setAddressFilter={(newAddressFilter: string) =>
                setSort({ addressFilter: newAddressFilter })
              }
              trustedUsersList={trustedUsers}
              setTrustedUsersList={setTrustedUsers}
              isTrustedSort={isTrustedSort || false}
              address={address || ''}
              trigger={trigger || false}
              isNotDapplet={isNotDapplet}
              setModalOpen={setModalOpen}
            />
          </MainContent>
        </>
      )}

      {isNotDapplet && <StyledOverlay isNotDapplet={isNotDapplet} />}
    </Wrapper>
  )
}

export default connect(mapState, mapDispatch)(Layout)
