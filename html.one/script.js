(function (global, factory) {
  const array_unique = array => [...new Set(array)];
  const array_get = (object, path, defaultValue) => {
    // 将路径分割成数组
    const pathArray = Array.isArray(path) ? path : path.split('.');

    // 使用 Array.prototype.reduce 遍历路径数组，逐级访问对象属性
    return pathArray.reduce((obj, key) =>
      (obj && typeof obj[key] !== 'undefined') ? obj[key] : defaultValue, object);
  }
  const array_to_tree = (array, root = 0) => array
    .filter(item => item.parent === root)
    .map(item => ({
      ...item,
      children: arrayToTreeRecursive(arr, item.id)
    }));
  function rebuild_metas(obj, type, array) {
    return Object.values(array || obj.metas || [])
      .filter(v => type ? v.type == type : v)
      .map(v => {

        v.relationships = obj.relationships.filter(v_r => v_r.meta == v.id)
          ;

        v.contents =
          array_unique([...v.contents || [], ...v.relationships.filter(v_r => v_r.content).map(v_r => v_r.content)])
            .reduce((t, v_c) => typeof v_c == 'string' ? (obj.contents[v_c] ? [...t, obj.links[v_c]] : t) : [...t, v_c], [])
          ;

        if (v.fetch_links) {
          fetch(v.fetch_links.url).then(res => {

          })
        }

        v.links =
          array_unique([...v.links || [], ...v.relationships.filter(v_r => v_r.link).map(v_r => v_r.link)])
            .reduce((t, v_l) => typeof v_l == 'string' ? (obj.links[v_l] ? [...t, obj.links[v_l]] : t) : [...t, v_l], [])
            .map(v_l => ({ ...v_l, url: v_l.url || (v_l.github ? 'https://github.com/' + v_l.github : ''), }))
          ;

        v.files =
          array_unique([...v.files || [], ...v.relationships.filter(v_r => v_r.file).map(v_r => v_r.file)])
            .reduce((t, v_f) => typeof v_f == 'string' ? (obj.contents[v_f] ? [...t, obj.links[v_f]] : t) : [...t, v_f], [])
          ;
        if (type == 'category') {
          v.children = rebuild_metas(obj, 'category', [...v.children || []]);
          v.tags = rebuild_metas(obj, null,
            array_unique([...v.tags || [], ...Object.values(obj.metas).filter(v_m => v_m.type == 'tag' && v_m.parent == 'v.id')])
              .reduce((t, v_m) => typeof v_m == 'string' ? (obj.contents[v_m] ? [...t, obj.links[v_m]] : t) : [...t, v_m], [])
            ,
          )
        }

        return v;
      })
      .sort((a, b) => a.order - b.order);
  }
  function rebuild_contents(obj, array, type,) { }
  function rebuild_links(obj, array, type,) { }
  function rebuild_files(obj, array, type,) { }

  global['$' + AppSlug] = {
    fetch: () => fetch('./repository.json')
      .then(response => response.json())
      .then(data => {
        let $return = {
          title: data.title || AppName,
          ...data[AppSlug],
          before_render_categor() {

          },
          after_render_category() {

          },
        };
        document.title = $return.title;
        let $data = data[AppSlug];
        // console.log(`assemblyData`, data);
        // console.log(`assemblyData`, data.onenav.metas);
        $return['categories'] = rebuild_metas($data, 'category');
        return $return;
      })
      .catch(error => {
        console.error('Error loading repository.json:', error);
      })
  }
})(this, function () {
  'use strict';
});