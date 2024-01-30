import { FAKE_DATA_RESOLVE_ID_MAP } from 'common/services/fake/fakeData';
import './dataPage.scss';

export function DataPage() {
    return (
        <div className={`page-mod`}>
            <div className='data-page-mod'>
                {
                    Object.keys(FAKE_DATA_RESOLVE_ID_MAP).map((key, index) => {
                        const item = FAKE_DATA_RESOLVE_ID_MAP[Number(key)].data;
                        return (
                            <div key={`name${index}`}>
                                <div className='head'><a href={item.link} style={{color: '#fff'}} target="_blank">{`${item.name}(${item.id})`}</a></div>
                                {
                                    Object.keys(item.examples).map((key, index) => {
                                        const t = item.examples[key];
                                        return (
                                            <div id={key} className='cell' key={`cell${index}`}>
                                                <a href={item.linkFake.replace('{%case%}', key)} target="_blank"><div className='title'>{key}</div></a>
                                                <div className='detail'>{t.description}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}